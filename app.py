from rest_framework.response import Response
from django.db import connection
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

from langchain_groq import ChatGroq
from langchain_community.utilities import ArxivAPIWrapper, WikipediaAPIWrapper, PubMedAPIWrapper
from langchain_community.tools import ArxivQueryRun, WikipediaQueryRun, DuckDuckGoSearchRun
from langchain_community.tools.pubmed.tool import PubmedQueryRun
from langchain.agents import initialize_agent, AgentType
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from langchain_community.agent_toolkits.sql.base import create_sql_agent
from langchain_community.utilities import SQLDatabase
from langchain_community.agent_toolkits.sql.toolkit import SQLDatabaseToolkit

from django.conf import settings
import dotenv
import os
import openai
import logging
import re
from openai import OpenAI

logger = logging.getLogger(__name__)
dotenv.load_dotenv()

# Import your Delivery model
from base.models import Delivery

def extract_sql_query(response):
    # Look for a SQL query in the response
    sql_match = re.search(r'SELECT.*?;', response, re.IGNORECASE | re.DOTALL)
    if sql_match:
        return sql_match.group(0)
    return None

def improve_response_with_openai(response_text):
    try:
        client = OpenAI(api_key = os.getenv("OPENAI_API_KEY"),)
        prompt = f"Refine and enhance the following response:\n\n{response_text}\n\nProvide a clear, detailed, and friendly explanation."

        completion = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": prompt}
            ]
        )

        return completion.choices[0].message.content.strip()
    except Exception as e:
        logger.error(f"Error while improving response with OpenAI: {str(e)}", exc_info=True)
        return response_text

@api_view(["POST"])
def chat_with_db(request):
    user_query = request.data.get('query')
    
    if not user_query:
        return Response({"error": "No query provided"}, status=400)

    db_path = settings.DATABASES['default']['NAME']
    db = SQLDatabase.from_uri(f"sqlite:///{db_path}")

    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        return Response({"error": "GROQ API key not found"}, status=500)
    
    custom_prompt = """
        You are an AI assistant that helps with database queries related to shipments.
        The database has a table called `base_delivery` with the following columns:
        - `country` (TEXT): The country to which the shipment was sent.
        - `shipment_name` (TEXT): The name of the shipment.
        - `scheduled_delivery_date` (DATETIME): The date the shipment is scheduled to be delivered.
        - `delivered_to_client` (DATETIME): The date and time the shipment was delivered to the client.
        - `recorded_delivery_date` (DATETIME): The recorded date of the delivery.
        - `packaging_price` (FLOAT): The price of the packaging.
        - `unit_price` (FLOAT): The price per unit of the shipment.
        - `manufacturing_site` (TEXT): The site where the shipment was manufactured.
        - `transportation_mode` (TEXT): The mode of transportation used (e.g., 'Air').

        Please format your response in the following way:

        Country: [country_name], Shipment: [shipment_name], Scheduled Delivery Date: [YYYY/MM/DD HH:MM], 
        Delivered to Client: [YYYY/MM/DD HH:MM], Recorded Delivery Date: [YYYY/MM/DD HH:MM],
        Packaging Price: [pack_price], Unit Price: [unit_price], Manufacturing Site: [manufacturing_site]

    """
    # Always include the SQL query used to obtain this data.

    llm = ChatGroq(groq_api_key=api_key, model_name="Llama3-8b-8192", streaming=True)
    # Create SQL agent with custom prompt
    toolkit = SQLDatabaseToolkit(db=db, llm=llm)
    agent = create_sql_agent(
        llm=llm,
        toolkit=toolkit,
        verbose=True,
        agent_type=AgentType.ZERO_SHOT_REACT_DESCRIPTION,
        handle_parsing_errors=True
    )

    # Run the agent
    try:
        response = agent.run(user_query)
        logger.info(f"Agent response: {response}")

        # Improve the response using OpenAI
        improved_response = improve_response_with_openai(response)

        # Extract SQL query from the response
        sql_query = extract_sql_query(improved_response)
        
        if sql_query:
            logger.info(f"Extracted SQL Query: {sql_query}")
            # Execute the SQL query
            with connection.cursor() as cursor:
                cursor.execute(sql_query)
                result = cursor.fetchall()
            
            logger.info(f"SQL Result: {result}")
            
            return Response({
                "response": improved_response, 
                "sql_query": sql_query,
                "sql_result": result
            })
        else:
            return Response({
                "response": improved_response,
                "error": "No SQL query found in the response"
            })
    except Exception as e:
        logger.error(f"Error in chat_with_db: {str(e)}", exc_info=True)
        return Response({"error": str(e)}, status=500)

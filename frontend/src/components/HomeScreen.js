import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Image } from 'react-bootstrap';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function HomeScreen() {
  const [isBusinessAccount, setIsBusinessAccount] = useState(false);
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [chartData, setChartData] = useState([]);
  const [chartType, setChartType] = useState('bar chart'); // default chart type

  const handleQuerySubmit = async () => {
    try {
      const res = await axios.post("http://127.0.0.1:8000/api/chats/chat-with-db/", { query });
      if (res.data.openai_error) {
        setResponse(`${res.data.response}\n\nNote: Additional details could not be fetched due to an error: ${res.data.openai_error}`);
      } else {
        setResponse(res.data.response);
      }
    } catch (error) {
      console.error('Error fetching data:', error.response ? error.response.data : error.message);
      setResponse('An error occurred while processing your request. Please try again.');
    }
  };

  const handleChartSubmit = async () => {
    try {
      const res = await axios.post("http://127.0.0.1:8000/api/chats/chart-with-db/", { query });
      if (res.data.chart_data && Array.isArray(res.data.chart_data)) {
        setChartData(res.data.chart_data);  // Set data for charts
        setChartType(res.data.chart_type || 'bar chart');  // Set chart type if available
      } else {
        setChartData([]);  // Clear chart data if not available
      }
    } catch (error) {
      console.error('Error fetching chart data:', error);
      setChartData([]);  // Clear chart data on error
    }
  };

  return (
    <Container>
      <div className="text-center mb-4">
        <Image 
          src="/images/ship.png" 
          fluid 
          alt="Homescreen banner" 
          style={{ width: '70%', maxHeight: '70%', objectFit: 'cover' }}
        />
      </div>
      <Row>
        <Col md={6} className="d-flex flex-column justify-content-center">
          <h2 className="mb-4">Calculations made simple</h2>
          <h2>Streamline your pipeline</h2>
        </Col>
        <Col md={6}>
          <div className="p-4 border rounded">
            <h3 className="mb-4">Login</h3>
            <Form>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control type="email" placeholder="Enter email" />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Password" />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicCheckbox">
                <Form.Check 
                  type="switch"
                  id="business-switch"
                  label="Business Account"
                  checked={isBusinessAccount}
                  onChange={() => setIsBusinessAccount(!isBusinessAccount)}
                />
              </Form.Group>

              <Button variant="primary" type="submit" className="w-100">
                Login
              </Button>
            </Form>
          </div>
        </Col>
      </Row>

      {/* Chatbot Section */}
      <Row className="mt-5">
        <Col md={12}>
          <div className="p-4 border rounded">
            <h3 className="mb-4">Chat with InsightBot AI</h3>
            <Form>
              <Form.Group className="mb-3" controlId="queryInput">
                <Form.Label>Ask a question about your shipment data:</Form.Label>
                <Form.Control 
                  type="text" 
                  placeholder="Type your query here..." 
                  value={query} 
                  onChange={(e) => setQuery(e.target.value)} 
                />
              </Form.Group>
              <Button variant="primary" type="button" className="w-100" onClick={handleQuerySubmit}>
                Send Query
              </Button>

              <Button variant="success" onClick={handleChartSubmit} className="ml-2">
                Generate Chart
              </Button>
            </Form>

            {response && (
              <div>
                <h4>Response:</h4>
                <pre>{response}</pre>
              </div>
            )}

            {/* Render the chart only if chartData is available and valid */}
            {chartData && Array.isArray(chartData) && chartData.length > 0 && (
              <div>
                <h4>Chart:</h4>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="label" />  {/* Updated dataKey based on the backend response format */}
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#8884d8" />  {/* Updated dataKey based on the backend response format */}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default HomeScreen;

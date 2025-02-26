import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Form } from "react-bootstrap";

const API_KEY = "AIzaSyA7_NuREIzR7UrglA0rO7gl-XsFeGksWX8";

const extractChannelId = async (url: string): Promise<string | null> => {
  const channelRegex = /youtube\.com\/channel\/([a-zA-Z0-9_-]+)/;
  const shortRegex = /youtu\.be\/([a-zA-Z0-9_-]+)/;
  const handleRegex = /youtube\.com\/@([a-zA-Z0-9_-]+)/;

  if (channelRegex.test(url)) return url.match(channelRegex)?.[1] || null;
  if (shortRegex.test(url)) return url.match(shortRegex)?.[1] || null;

  const handleMatch = url.match(handleRegex);
  if (handleMatch) {
    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/channels?part=id&forHandle=${handleMatch[1]}&key=${API_KEY}`
      );
      const data = await response.json();
      return data.items?.[0]?.id || null;
    } catch (error) {
      console.error("Error fetching channel ID:", error);
      return null;
    }
  }

  return null;
};

const Analyze: React.FC = () => {
  const [url, setUrl] = useState<string>("");
  const [subscribers, setSubscribers] = useState<string | null>(null);
  const [views, setViews] = useState<string | null>(null);
  const [videos, setVideos] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubscribers(null);
    setViews(null);
    setVideos(null);
  
    try {
      const channelId = await extractChannelId(url);
      if (!channelId) {
        console.error("Invalid YouTube channel URL");
        alert("Invalid YouTube channel URL. Please enter a correct one.");
        return;
      }
  
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${channelId}&key=${API_KEY}`
      );
      const data = await response.json();
  
      if (!data.items || data.items.length === 0) {
        console.error("No channel data found.");
        alert("Invalid channel ID or no data available.");
        return;
      }
  
      const stats = data.items[0].statistics;
      setSubscribers(stats.subscriberCount);
      setViews(stats.viewCount);
      setVideos(stats.videoCount);
    } catch (error) {
      console.error("Error fetching channel statistics:", error);
      alert("An error occurred while fetching data. Please try again.");
    }
  };
  

  return (
    <div>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="channelUrl">
          <Form.Label>Channel URL:</Form.Label>
          <Form.Control
            type="text"
            name="url" style={{ width: "42%" }}
            onChange={handleChange}
            value={url}
            required
            placeholder="Enter Channel URL"
          />
        </Form.Group>
        
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
      <br />

      {subscribers !== null && <p><h3>You have {subscribers} Subscribers</h3></p>}
      {views !== null && <p><h3>You have {views} Views</h3></p>}
      {videos !== null && <p><h3>You have {videos} Videos</h3></p>}
    </div>
  );
};

export default Analyze;

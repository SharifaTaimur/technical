import React from "react";
import { Card, ListGroup } from "react-bootstrap";
import "@formatjs/intl-datetimeformat/add-all-tz";

const SummaryCard = ({ data, totalmembers, lastadded }) => {
  let lastadd,
    publishedcamp = 0,
    usersinvited = 0;
  if (lastadded.length > 0) {
    lastadd = Date.parse(lastadded["0"].created_at);
    lastadded.map((val, index) => {
      usersinvited += val.stats.invited_users_count;
      publishedcamp += val.stats.published_campaigns_count;
    });
  }

  return (
    <Card style={{ width: "58rem", fontWeight: "bold" }} bg="dark">
      <Card.Header style={{ color: "white" }}>Team Summary</Card.Header>

      <ListGroup variant="flush">
        <ListGroup.Item>
          Total Number of Team Members : {totalmembers} Members
        </ListGroup.Item>
        <ListGroup.Item>
          Last user added on :
          {new Intl.DateTimeFormat("en-GB", {
            year: "numeric",
            month: "long",
            day: "2-digit",
          }).format(lastadd)}
        </ListGroup.Item>
        <ListGroup.Item>
          Total users invited : {usersinvited} users
        </ListGroup.Item>
        <ListGroup.Item>
          Total Published campaigns : {publishedcamp} publications
        </ListGroup.Item>
      </ListGroup>
    </Card>
  );
};

export default SummaryCard;

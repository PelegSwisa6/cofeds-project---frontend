import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";
import Grid from "@mui/material/Grid";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import { Link } from "react-router-dom";

import ManagmentImg from "../images/inventory-management.png";
import WaitOrderImg from "../images/waitOrder.webp";
import ReadyOrderImg from "../images/readyOrder.jpg";
import HistoryOrdersImg from "../images/orders-history.png";

const items = [
  {
    link: "/businesspage/ready-orders",
    image: ReadyOrderImg,
    title: "הזמנות מוכנות לאיסוף",
  },
  {
    link: "/businesspage/open-orders",
    image: WaitOrderImg,
    title: "הזמנות ממתינות להכנה",
  },
  {
    link: "/businesspage/order-history",
    image: HistoryOrdersImg,
    title: "הסטוריית הזמנות",
  },
  {
    link: "/businesspage/inventory-managment",
    image: ManagmentImg,
    title: "ניהול מלאי",
  },
];

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.primary,
  textDecoration: "none",
}));

function BussinesCards() {
  return (
    <Box
      sx={{
        display: "flex",
        height: "100%",
        width: "100%",
        justifyContent: "center",
      }}
    >
      <Card sx={{ maxWidth: 1000, maxHeight: 1000 }}>
        <Grid container rowSpacing={4} columnSpacing={{ xs: 5, sm: 2, md: 4 }}>
          {items.map((item) => (
            <Grid key={item.link} item xs={6}>
              <Item>
                <Link to={item.link}>
                  <CardActionArea>
                    <CardMedia
                      component="img"
                      height="300"
                      src={item.image}
                      alt={item.title}
                    />
                    <CardContent></CardContent>
                  </CardActionArea>
                </Link>
                <Typography gutterBottom variant="h5" component="div">
                  {item.title}
                </Typography>
              </Item>
            </Grid>
          ))}
        </Grid>
      </Card>
    </Box>
  );
}

export default BussinesCards;

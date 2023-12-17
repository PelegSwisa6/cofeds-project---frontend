import React, { useState } from "react";
import {
  Checkbox,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";

function PrepareForBussines({ order }) {
  const product_list = JSON.parse(order.product_list);
  const [selectedItems, setSelectedItems] = useState([]);
  const handleItemSelect = (itemId) => {
    if (selectedItems.includes(itemId)) {
      setSelectedItems(selectedItems.filter((id) => id !== itemId));
    } else {
      setSelectedItems([...selectedItems, itemId]);
    }
  };

  return (
    <List>
      {product_list
        .filter((item) => !item.sale)
        .map((item) => (
          <ListItem key={item.id}>
            <ListItemText
              primary={
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "row-reverse",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography variant="body2" align="right" dir="rtl">
                    {"קוד: " + item.name}
                  </Typography>
                  <Checkbox />
                </div>
              }
              secondary={
                <React.Fragment>
                  <div>
                    <Typography variant="body2" align="right">
                      {"קוד: " + item.id}
                    </Typography>
                    <Typography variant="body2" align="right">
                      {"כמות: " + item.quantity}
                    </Typography>
                  </div>
                </React.Fragment>
              }
            />
          </ListItem>
        ))}
    </List>
  );
}

export default PrepareForBussines;

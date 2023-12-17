import React, { useState } from "react";
import {
  Checkbox,
  List,
  ListItem,
  ListItemText,
  Typography,
  FormControlLabel,
} from "@mui/material";

function PrepareYourSelf({ cart }) {
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
      {cart
        .filter((item) => !item.product.sale)
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
                    {"קוד: " + item.product.name}
                  </Typography>
                  <Checkbox />
                </div>
              }
              secondary={
                <React.Fragment>
                  <Typography variant="body2" align="right">
                    {"קוד: " + item.product.id}
                  </Typography>
                  <Typography variant="body2" align="right">
                    {"כמות: " + item.quantity}
                  </Typography>
                </React.Fragment>
              }
            />
          </ListItem>
        ))}
    </List>
  );
}

export default PrepareYourSelf;

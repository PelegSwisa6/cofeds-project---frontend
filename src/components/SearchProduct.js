import { Grid, Typography, CardMedia, Button } from "@mui/material";
import { useState } from "react";
import Box from "@mui/material/Box";

function SearchProduct({ item }) {
  const [amount, setAmount] = useState(1);

  const handleAmountIncrease = () => {
    setAmount(amount + 1);
  };

  const handleAmountDecrease = () => {
    if (amount > 1) {
      setAmount(amount - 1);
    }
  };
  return (
    <Grid display="flex" alignItems="stretch" sx={{ width: "50%" }}>
      <CardMedia
        component="img"
        //item.img should be here
        image={
          "https://www.rami-levy.co.il/_ipx/w_320,f_webp/https://img.rami-levy.co.il/product/7290000604015/123510/medium.jpg"
        }
        alt={item.name}
        sx={{ width: 80, height: 80, mr: 2 }}
      />
      <Typography variant="subtitle1" fontWeight="bold" mb={0.5}>
        {item.name}
      </Typography>
      <Box>
        <Box display="flex" alignItems="center">
          <Button
            onClick={handleAmountDecrease}
            variant="outlined"
            size="small"
            sx={{ mr: 1 }}
          >
            -
          </Button>
          <Typography variant="subtitle1">{amount}</Typography>
          <Button
            onClick={handleAmountIncrease}
            variant="outlined"
            size="small"
            sx={{ ml: 1 }}
          >
            +
          </Button>
        </Box>
      </Box>
    </Grid>
  );
}

export default SearchProduct;

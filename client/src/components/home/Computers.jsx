import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Grid from "@mui/material/Grid2";
import Features from "./Features";
import { useDispatch, useSelector } from "react-redux";
import { setCartItem } from "../../state";
import { toast } from "sonner";
import { green, red } from "@mui/material/colors";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { useAuth } from "../../context/AuthContext";
import { setLocalStock } from "../../state";
import { Box } from "@mui/material";
import Skeleton from "@mui/material/Skeleton";
import axios from "axios";

export default function ComputerLists({ filteredItems }) {
  const { currentUser } = useAuth();
  const stock = useSelector((state) => state.localStock);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5001/api/getAllStock"
        );
        if (response.status === 200) {
          dispatch(setLocalStock(response.data));
        } else {
          console.log("Failed to fetch stock data:", response.data.message);
        }
      } catch (error) {
        console.log("Error fetching stock data:", error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStockData();
  }, []);

  if (loading) {
    return (
      <Grid
        container
        xs={12}
        sm={6}
        md={4}
        sx={{
          width: "60%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          margin: "0 auto",
          marginTop: 5,
          gap: 2,
        }}
      >
        {Array.from({ length: 15 }).map((_, index) => (
          <React.Fragment key={index}>
            <Box sx={{ pt: 0.5 }}>
              <Skeleton
                variant="rectangular"
                animation="wave"
                width={345}
                height={251}
              />
              <Skeleton />
              <Skeleton width="60%" />
            </Box>
          </React.Fragment>
        ))}
      </Grid>
    );
  }

  const addToCart = (item) => {
    toast(`${item.name} added to the cart`, {
      icon: <CheckCircleIcon sx={{ color: green[500] }} />,
    });
    dispatch(setCartItem(item));
  };

  const handleCart = async (item) => {
    if (!currentUser || currentUser === "") {
      toast.error(`Please login`, {
        icon: <CancelIcon sx={{ color: red[500] }} />,
      });
    } else {
      try {
        // Step 1: Check stock availability for the selected item
        const response = await axios.get(
          `http://localhost:5001/api/getStock?id=${item.id}`
        );

        if (response.status === 200 && response.data.quantity > 0) {
          const updatedItem = { ...item, quantity: response.data.quantity };
          // Add the updated item to the cart
          addToCart(updatedItem);
        } else {
          // Stock is not available
          toast.error(`Out of stock`, {
            icon: <CancelIcon sx={{ color: red[500] }} />,
          });
        }
      } catch (error) {
        console.error("Error checking stock:", error.message);
        toast(`Error checking stock`, {
          icon: <CancelIcon sx={{ color: red[500] }} />,
        });
      }
    }
  };

  return (
    <Grid
      container
      spacing={4}
      sx={{
        width: "100%",
        maxWidth: "1200px",
        margin: "0 auto",
        justifyContent: "center",
      }}
    >
      {filteredItems.map((item) => {
        const matchingStock = stock.find((s) => s.name === item.name);
        return (
          <Grid container xs={12} sm={6} md={4} key={item.id}>
            <Card
              sx={{
                width: "100%",
                maxWidth: 345,
                height: "auto",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <CardMedia
                component="img"
                alt={item.title}
                height="240"
                image={item.image}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {item.title}
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {item.description}
                </Typography>
              </CardContent>
              <CardActions>
                {matchingStock && matchingStock.quantity === 0 ? (
                  <Button disabled>
                    Unavailable
                  </Button>
                ) : (
                  <Button
                    size="small"
                    onClick={() => {
                      handleCart(item);
                    }}
                  >
                    Add
                  </Button>
                )}
                <Button size="small" onClick={handleOpen}>
                  Learn More
                </Button>
                <Modal
                  open={open}
                  onClose={handleClose}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                  <Box
                    sx={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      boxShadow: 24,
                      // backgroundColor: "#f9f9f9",
                      padding: 4,
                      borderRadius: 2,
                    }}
                  >
                    <Features />
                  </Box>
                </Modal>
              </CardActions>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
}

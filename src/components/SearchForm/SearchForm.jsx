import { useReducer, useState } from "react";
import {
  Box,
  Button,
  Divider,
  InputAdornment,
  MenuItem,
  Paper,
  Popper,
  Select,
  Tab,
  Tabs,
  TextField,
} from "@mui/material";
import { ArrowDropDown, SearchOutlined } from "@mui/icons-material";
import "../../styles/components/SearchForm.scss";

const priceReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE_MAX":
      return { ...state, max: action.payload };
    case "CHANGE_MIN":
      return { ...state, min: action.payload };
    default:
      return state;
  }
};

const SearchForm = () => {
  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [propertyType, setPropertyType] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);

  const [price, priceDispatch] = useReducer(priceReducer, { max: 0, min: 0 });

  const priceModalOpen = Boolean(anchorEl);
  const priceModalID = priceModalOpen ? "simple-popper" : undefined;

  const handleClick = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleTabValueChange = (e, newValue) => {
    setTabValue(newValue);
  };

  const handleSearchTermChange = ({ target: { value: newValue } }) => {
    // For production work we can use debouncing technique
    // to delay the request until we finish typing.
    setSearchTerm(newValue);
  };

  const handleChangePropertyType = ({ target: { value: newValue } }) => {
    setPropertyType(newValue);
  };

  return (
    <Box className="search-form">
      <Box className="tabs">
        <Tabs value={tabValue} onChange={handleTabValueChange}>
          <Tab className="tab" label="Rent" />
          <Tab className="tab" label="Buy" />
        </Tabs>
      </Box>

      <Box className="filter-container">
        <SearchTextField value={searchTerm} onChange={handleSearchTermChange} />

        <PropertyTypeSelect
          value={propertyType}
          onChange={handleChangePropertyType}
        />

        <Box
          aria-describedby={priceModalID}
          onClick={handleClick}
          className="price-popup-toggler"
        >
          <p>
            {price.min || price.max
              ? `${price.min} min to ${price.max} max`
              : "Price"}
          </p>
          <ArrowDropDown />
        </Box>

        <PricePopper
          anchorEl={anchorEl}
          open={priceModalID}
          state={price}
          dispatcher={priceDispatch}
          id={priceModalID}
        />

        <Button className="search-button">
          <SearchOutlined sx={{ color: "#fff" }} />
        </Button>
      </Box>
    </Box>
  );
};

const SearchTextField = ({ value, onChange }) => {
  return (
    <TextField
      value={value}
      onChange={onChange}
      className="search-input"
      placeholder="City, community or building"
      InputProps={{
        type: "search",
        startAdornment: (
          <InputAdornment position="start">
            <SearchOutlined />
          </InputAdornment>
        ),
      }}
    />
  );
};

const PropertyTypeSelect = ({ value, onChange }) => {
  return (
    <Select
      className="select-input property-type"
      value={value}
      onChange={onChange}
    >
      <MenuItem disabled value={value}>
        <span className="select-placeholder">Property Type</span>
      </MenuItem>
      <MenuItem value={"Apartment"}>Apartment</MenuItem>
      <MenuItem value={"Villa"}>Villa</MenuItem>
      <MenuItem value={"Duplex"}>Duplex</MenuItem>
    </Select>
  );
};

const PricePopper = ({ open, anchorEl, id, state, dispatcher }) => {
  return (
    <Popper
      placement="bottom-end"
      sx={{ mt: 2 }}
      id={id}
      open={open}
      anchorEl={anchorEl}
    >
      <Paper className="price-popup-container">
        <Box sx={{ display: "flex", alignItems: "center", gap: 4 }}>
          <Select
            className="select-input"
            value={state.min}
            onChange={({ target: { value } }) =>
              dispatcher({ type: "CHANGE_MIN", payload: value })
            }
          >
            <MenuItem disabled value={0}>
              <span className="select-placeholder">Min. Price</span>
            </MenuItem>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={20}>20</MenuItem>
            <MenuItem value={30}>30</MenuItem>
          </Select>

          <p>_____</p>

          <Select
            className="select-input"
            value={state.max}
            onChange={({ target: { value } }) =>
              dispatcher({ type: "CHANGE_MAX", payload: value })
            }
          >
            <MenuItem disabled value={0}>
              <span className="select-placeholder">Max. Price</span>
            </MenuItem>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={20}>20</MenuItem>
            <MenuItem value={30}>30</MenuItem>
          </Select>
        </Box>

        <Divider sx={{ mt: 2 }} />
      </Paper>
    </Popper>
  );
};

export default SearchForm;

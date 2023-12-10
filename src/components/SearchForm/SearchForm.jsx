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
  Typography,
} from "@mui/material";
import {
  ArrowDownwardOutlined,
  ArrowDropDown,
  ArrowUpwardOutlined,
  SearchOutlined,
} from "@mui/icons-material";
import "../../styles/components/SearchForm.scss";

const minMaxReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE_MAX":
      return { ...state, max: action.payload };
    case "CHANGE_MIN":
      return { ...state, min: action.payload };
    case "RESET":
      return { min: 0, max: 0 };
    default:
      return state;
  }
};

const SearchForm = () => {
  const [tabValue, setTabValue] = useState("rent");
  const [moreOptions, setMoreOptions] = useState(false);

  const handleTabValueChange = (e, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box className="search-form">
      <TabBar value={tabValue} onChange={handleTabValueChange} />

      <Box className="row">
        <SearchTextField placeholder="City, community or building" />

        <PropertyTypeSelect />

        <BedNBathPopper />

        <PricePopper />

        <Button className="button-primary">
          <SearchOutlined sx={{ color: "#fff" }} />
        </Button>
      </Box>

      {moreOptions && (
        <Box mt={2} className="row">
          <CompletionStatus />
          <AreaPopper />
          {/* for the implementation of this keyword picker we should use 'chip multi select' based on autocomplete input */}
          <SearchTextField placeholder="Keywords: e.g. beach, chiller" />
        </Box>
      )}

      <Box className="form-footer">
        <Typography>You're on {tabValue.toUpperCase()} mode!</Typography>
        <Typography
          className="link more-options-button"
          onClick={() => setMoreOptions(!moreOptions)}
        >
          {moreOptions ? "Show less options" : "Show more options"}
          {moreOptions ? <ArrowUpwardOutlined /> : <ArrowDownwardOutlined />}
        </Typography>
      </Box>
    </Box>
  );
};

const TabBar = ({ value, onChange }) => {
  return (
    <Box className="search-form__tabs">
      <Tabs value={value} onChange={onChange}>
        <Tab value={"rent"} className="tab" label="Rent" />
        <Tab value={"buy"} className="tab" label="Buy" />
      </Tabs>
    </Box>
  );
};

const SearchTextField = ({ placeholder }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchTermChange = ({ target: { value: newValue } }) => {
    // For production work we can use debouncing technique
    // to delay the request until we finish typing.
    setSearchTerm(newValue);
  };

  return (
    <TextField
      value={searchTerm}
      onChange={handleSearchTermChange}
      className="search-input"
      placeholder={placeholder}
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

const PropertyTypeSelect = () => {
  const [propertyType, setPropertyType] = useState(0);

  const handleChangePropertyType = ({ target: { value: newValue } }) => {
    setPropertyType(newValue);
  };

  return (
    <Select
      className="select-input property-type"
      value={propertyType}
      onChange={handleChangePropertyType}
    >
      <MenuItem sx={{ display: "none" }} disabled value={propertyType}>
        <span className="select-placeholder">Property Type</span>
      </MenuItem>
      <MenuItem value={"Apartment"}>Apartment</MenuItem>
      <MenuItem value={"Villa"}>Villa</MenuItem>
      <MenuItem value={"Duplex"}>Duplex</MenuItem>
    </Select>
  );
};

const CompletionStatus = () => {
  const [status, setStatus] = useState(0);

  const handleChangeStatus = ({ target: { value: newValue } }) => {
    setStatus(newValue);
  };

  return (
    <Select
      className="select-input completion-status"
      value={status}
      onChange={handleChangeStatus}
    >
      <MenuItem sx={{ display: "none" }} disabled value={status}>
        <span className="select-placeholder">Completion Status</span>
      </MenuItem>
      <MenuItem value={"off-plan"}>Off-plan</MenuItem>
      <MenuItem value={"ready"}>Ready</MenuItem>
    </Select>
  );
};

const PricePopper = () => {
  const [price, priceDispatch] = useReducer(minMaxReducer, { max: 0, min: 0 });
  const [priceAnchorEl, setPriceAnchorEl] = useState(null);

  const priceModalOpen = Boolean(priceAnchorEl);
  const priceModalID = priceModalOpen ? "simple-popper-price" : undefined;

  const handleOpenPricePopper = (event) => {
    setPriceAnchorEl(priceAnchorEl ? null : event.currentTarget);
  };

  return (
    <>
      <Box
        aria-describedby={priceModalID}
        onClick={handleOpenPricePopper}
        className="price-popup-toggler toggler"
      >
        <p>
          {price.min || price.max
            ? `${price.min} min to ${price.max} max`
            : "Price"}
        </p>
        <ArrowDropDown />
      </Box>
      <Popper
        placement="bottom-end"
        sx={{ mt: 2 }}
        id={priceModalID}
        open={priceModalOpen}
        anchorEl={priceAnchorEl}
      >
        <Paper className="price-popup-container popup-container">
          <Box sx={{ display: "flex", alignItems: "center", gap: 4 }}>
            <Select
              className="select-input"
              value={price.min}
              onChange={({ target: { value } }) =>
                priceDispatch({ type: "CHANGE_MIN", payload: value })
              }
            >
              <MenuItem disabled value={0}>
                <span className="select-placeholder">Min. Price</span>
              </MenuItem>
              <MenuItem value={10}>10 EGP</MenuItem>
              <MenuItem value={20}>20 EGP</MenuItem>
              <MenuItem value={30}>30 EGP</MenuItem>
            </Select>

            <p>_____</p>

            <Select
              className="select-input"
              value={price.max}
              onChange={({ target: { value } }) =>
                priceDispatch({ type: "CHANGE_MAX", payload: value })
              }
            >
              <MenuItem disabled value={0}>
                <span className="select-placeholder">Max. Price</span>
              </MenuItem>
              <MenuItem value={10}>10 EGP</MenuItem>
              <MenuItem value={20}>20 EGP</MenuItem>
              <MenuItem value={30}>30 EGP</MenuItem>
            </Select>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Button
            variant="text"
            color="info"
            onClick={() => priceDispatch({ type: "RESET" })}
          >
            Reset
          </Button>
        </Paper>
      </Popper>
    </>
  );
};

const AreaPopper = () => {
  const [area, areaDispatch] = useReducer(minMaxReducer, { max: 0, min: 0 });
  const [areaAnchorEl, setAreaAnchorEl] = useState(null);

  const areaModalOpen = Boolean(areaAnchorEl);
  const areaModalID = areaModalOpen ? "simple-popper-area" : undefined;

  const handleOpenAreaPopper = (event) => {
    setAreaAnchorEl(areaAnchorEl ? null : event.currentTarget);
  };

  return (
    <>
      <Box
        aria-describedby={areaModalID}
        onClick={handleOpenAreaPopper}
        className="area-popup-toggler toggler"
      >
        <p>
          {area.min || area.max
            ? `${area.min} sqft min to ${area.max} sqft max`
            : "Area"}
        </p>
        <ArrowDropDown />
      </Box>

      <Popper
        placement="bottom-end"
        sx={{ mt: 2 }}
        id={areaModalID}
        open={areaModalOpen}
        anchorEl={areaAnchorEl}
      >
        <Paper className="area-popup-container popup-container">
          <Box sx={{ display: "flex", alignItems: "center", gap: 4 }}>
            <Select
              className="select-input"
              value={area.min}
              onChange={({ target: { value } }) =>
                areaDispatch({ type: "CHANGE_MIN", payload: value })
              }
            >
              <MenuItem disabled value={0}>
                <span className="select-placeholder">Min. Area</span>
              </MenuItem>
              <MenuItem value={10}>10 sqft</MenuItem>
              <MenuItem value={20}>20 sqft</MenuItem>
              <MenuItem value={30}>30 sqft</MenuItem>
            </Select>

            <p>_____</p>

            <Select
              className="select-input"
              value={area.max}
              onChange={({ target: { value } }) =>
                areaDispatch({ type: "CHANGE_MAX", payload: value })
              }
            >
              <MenuItem disabled value={0}>
                <span className="select-placeholder">Max. Area</span>
              </MenuItem>
              <MenuItem value={10}>10 sqft</MenuItem>
              <MenuItem value={20}>20 sqft</MenuItem>
              <MenuItem value={30}>30 sqft</MenuItem>
            </Select>
          </Box>

          <Divider sx={{ my: 2 }} />
          <Button
            variant="text"
            color="info"
            onClick={() => areaDispatch({ type: "RESET" })}
          >
            Reset
          </Button>
        </Paper>
      </Popper>
    </>
  );
};

const BedNBathPopper = () => {
  const renderPlaceholder = () => {
    if (!activeBathrooms.length || !activeBedrooms.length)
      return "Beds & Baths";

    return `${activeBedrooms.join("-")} Beds, ${activeBathrooms.join(
      "-"
    )} Baths`;
  };

  const [bedNBathAnchorEl, setBedNBathAnchorEl] = useState(null);
  const [activeBedrooms, setActiveBedRooms] = useState([]);
  const [activeBathrooms, setActiveBathrooms] = useState([]);

  const bedNBathModalOpen = Boolean(bedNBathAnchorEl);
  const bedNBathModalID = bedNBathModalOpen
    ? "simple-popper-bedNBath"
    : undefined;

  const handleOpenBedNBathPopper = (event) => {
    setBedNBathAnchorEl(bedNBathAnchorEl ? null : event.currentTarget);
  };

  const handleAddRemoveOption = (option, setter, activeList) => {
    if (activeList.includes(option)) {
      const filteredActiveOptions = activeList.filter(
        (room) => room !== option
      );
      setter(filteredActiveOptions);
    } else {
      setter((prev) => [...prev, option]);
    }
  };

  const bedrooms = ["Studio", "1", "2", "3", "4", "5"];
  const bathrooms = ["1", "2", "3", "4", "5"];

  return (
    <>
      <Box
        aria-describedby={bedNBathModalID}
        onClick={handleOpenBedNBathPopper}
        className="bedNBath-popup-toggler toggler"
      >
        <p>{renderPlaceholder()}</p>
        <ArrowDropDown />
      </Box>

      <Popper
        placement="bottom-end"
        sx={{ mt: 2 }}
        id={bedNBathModalID}
        open={bedNBathModalOpen}
        anchorEl={bedNBathAnchorEl}
      >
        <Paper className="bedNBath-popup-container popup-container">
          <Typography fontWeight={"bold"} mb={2}>
            Bedrooms
          </Typography>
          <Box display={"flex"} alignItems={"center"} gap={2}>
            {bedrooms.map((bedroom) => (
              <Box
                onClick={() =>
                  handleAddRemoveOption(
                    bedroom,
                    setActiveBedRooms,
                    activeBedrooms
                  )
                }
                key={bedroom}
                className={`card ${
                  activeBedrooms.includes(bedroom) ? "active" : ""
                }`}
              >
                {bedroom}
              </Box>
            ))}
          </Box>

          <Divider sx={{ my: 4 }} />

          <Typography fontWeight={"bold"} mb={2}>
            Bathrooms
          </Typography>
          <Box display={"flex"} alignItems={"center"} gap={2}>
            {bathrooms.map((bathroom) => (
              <Box
                onClick={() =>
                  handleAddRemoveOption(
                    bathroom,
                    setActiveBathrooms,
                    activeBathrooms
                  )
                }
                key={bathroom}
                className={`card ${
                  activeBathrooms.includes(bathroom) ? "active" : ""
                }`}
              >
                {bathroom}
              </Box>
            ))}
          </Box>
        </Paper>
      </Popper>
    </>
  );
};

export default SearchForm;

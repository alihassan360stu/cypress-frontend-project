import React, { useEffect, useState } from 'react';
import { Grid, Box, CircularProgress, Backdrop } from '@material-ui/core';
import { lighten, makeStyles, alpha } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';
import GridContainer from '@jumbo/components/GridContainer';
import PageContainer from '@jumbo/components/PageComponents/layouts/PageContainer';
import Divider from '@material-ui/core/Divider';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import Axios from 'axios';
// import { Map, InfoWindow, Marker, GoogleApiWrapper } from 'google-maps-react';
// import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"
// import { MapContainer, TileLayer, useMap, Marker, Popup } from 'react-leaflet'
// import 'maplibre-gl/dist/maplibre-gl.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import MapGL, {
  Popup,
  NavigationControl,
  FullscreenControl,
  ScaleControl,
  GeolocateControl,
  Marker
} from "react-map-gl";
import { useMemo } from 'react';
import Pin from './pin';
import moment from 'moment';

const MySwal = withReactContent(Swal);
const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: '100vh',
    padding: '2%',
    margin: '0 auto',
    backgroundColor: lighten(theme.palette.background.paper, 0.1),

  },
  titleRoot: {
    marginBottom: 14,
    color: theme.palette.text.primary,
  },
  textFieldRoot: {
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: alpha(theme.palette.common.dark, 0.12),
    }
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
  pageTitle: {
    color: theme.palette.text.primary,
    fontWeight: 800,
    lineHeight: 1.5,
    marginBottom: 20,
    textShadow: '6px 4px 6px hsla(0,0%,45.9%,.8)',
  },
  noRoleTitle: {
    color: theme.palette.warning.dark,
    fontWeight: 800,
    lineHeight: 1.5,
    marginBottom: 20,
    textShadow: '2px 2px 2px hsla(0,10%,85.9%,.8)',
  }
}));

const Toast = MySwal.mixin({
  target: '#myTest',
  customClass: {
    container: {
      position: 'absolute',
      zIndex: 999999999,
    }
  },
  toast: true,
  position: 'top',

  showConfirmButton: false,
  timer: 2000,
  timerProgressBar: true,
  onOpen: toast => {
    toast.addEventListener('mouseenter', Swal.stopTimer);
    toast.addEventListener('mouseleave', Swal.resumeTimer);
  },
});

const DEFAULT_VIEWPORT = {
  width: 800,
  height: 1600,
  longitude: -122.45,
  latitude: 37.78,
  zoom: 14,
};

const AddCompany =
  // compose(
  //   withProps({
  //     googleMapURL: "https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places",
  //     loadingElement: <div style={{ height: `100%` }} />,
  //     containerElement: <div style={{ height: `400px` }} />,
  //     mapElement: <div style={{ height: `100%` }} />,
  //   }),
  //   withScriptjs,
  //   withGoogleMap
  // )(
  (props) => {
    const classes = useStyles();
    const { authUser } = useSelector(({ auth }) => auth);
    const [busy, setBusy] = useState(false);
    const [locations, setLocations] = useState([]);
    const [viewport, setViewport] = useState({
      latitude: 24.8607,
      longitude: 67.0011,
      width: "100vw",
      height: "100vh",
      zoom: 10
    });
    const [popupInfo, setPopupInfo] = useState(null);
    const showMessage = (icon, text) => {
      Toast.fire({
        icon,
        title: text
      });
    }

    const getLocations = () => {
      try {
        Axios.post(authUser.api_url + '/get-locations').then(ans => {
          ans = ans.data;
          if (ans.status) {
            setLocations(ans.data)
            setTimeout(() => {
              getLocations();
            }, 5000);
          } else {
            showMessage('error', ans.message)
          }
        }).catch(e => {
          showMessage('error', e)
        })
      } catch (error) {
        showMessage('error', error)
      }
    }

    useEffect(() => {
      getLocations();
    }, [])

    const MAPBOX_TOKEN = "pk.eyJ1IjoidWJlcmRhdGEiLCJhIjoiY2pwY3owbGFxMDVwNTNxcXdwMms2OWtzbiJ9.1PPVl0VLUQgqrosrI2nUhg";

    const pins =
      locations.map((location, index) => (
        <Marker
          key={`marker-${index}`}
          longitude={location.lng}
          latitude={location.lat}
          anchor="bottom"
          onClick={e => {
            e.originalEvent.stopPropagation();
            setPopupInfo(location);
          }}
        >
          <Pin />
        </Marker>
      ))

    return (
      <PageContainer heading="" id='myTest'>
        <GridContainer>
          <Grid item xs={12}>
            <div>
              <Box className={classes.pageTitle} fontSize={{ xs: 30, sm: 30 }}>
                Map View
              </Box>
            </div>
            <Divider />
            <br />
            <MapGL
              style={{ height: 800, width: '100%' }}
              viewState={{ ...viewport }}
              mapboxAccessToken={MAPBOX_TOKEN}
              reuseMaps={true}
              optimizeForTerrain={true}
              dragPan={true}
              preserveDrawingBuffer={true}
              mapStyle={"mapbox://styles/mapbox/light-v9"}
              scrollZoom={true}
              onDrag={viewport => {
                setViewport(viewport.viewState)
              }}
              onZoom={viewport => {
                setViewport(viewport.viewState)
              }}
              onRotate={viewport => {
                setViewport(viewport.viewState)
              }}
            >

              <GeolocateControl position="top-left" />
              <FullscreenControl position="top-left" />
              <NavigationControl position="top-left" />
              <ScaleControl />

              {pins}

              {popupInfo && (
                <Popup
                  anchor="top"
                  longitude={Number(popupInfo.lng)}
                  latitude={Number(popupInfo.lat)}
                  onClose={() => setPopupInfo(null)}
                >
                  <Box>
                    <h2>LAST UPDATE | {moment(popupInfo.updated_at).utc().local().format('D/MMM/YYYY hh:mm a')}</h2>
                    {popupInfo.user &&
                      <div>
                        <h3>Username : <b>{popupInfo.user.username}</b></h3>
                        <h3>Talash Name : <b>{popupInfo.user.full_name}</b></h3>
                        {popupInfo.user.region &&
                          <h3>Region : <b>{popupInfo.user.region}</b></h3>
                        }
                        {popupInfo.user.range &&
                          <h3>Range : <b>{popupInfo.user.range}</b></h3>
                        }
                        {popupInfo.user.zone &&
                          <h3>Zone : <b>{popupInfo.user.zone}</b></h3>
                        }
                        {popupInfo.user.district &&
                          <h3>District : <b>{popupInfo.user.district}</b></h3>
                        }
                        {popupInfo.user.ps &&
                          <h3>PS : {popupInfo.user.ps}</h3>
                        }
                      </div>
                    }
                  </Box>
                </Popup>
              )}
            </MapGL>
          </Grid>
        </GridContainer>
        <Backdrop className={classes.backdrop} open={busy}>
          <CircularProgress color="secondary" />
        </Backdrop>
      </PageContainer>
    );
  };

// export default GoogleApiWrapper({
//   apiKey: 'AIzaSyCis9yjXQ0L3CeNPUZ3lkpAKDQPTNdELZc'
// })(AddCompany);

// export default compose(
//   withProps({
//     googleMapURL: "https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places",
//     loadingElement: <div style={{ height: `100%` }} />,
//     containerElement: <div style={{ height: `400px` }} />,
//     mapElement: <div style={{ height: `100%` }} />,
//   }),
//   withScriptjs,
//   withGoogleMap,
//   AddCompany)
export default AddCompany;

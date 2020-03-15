import React from 'react';
import RouteFields from './children/RouteFields/route-fields.component';
import { AddRouteHolder, MapHolder } from './add-route-page.style';
import { Map } from './children'

import { v4 as uuid } from 'uuid';

import { storageHelper } from '@utils';

const AddRoutePage = ({ webId }) => {

  const googleMapURL = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&v=3.exp&libraries=geometry,drawing,places`

  const points = [];

  const onPointAdded = point => {
    points.push(point);
  }

  const onSave = ({ name, description }) => {
    const route = {
      id: uuid(),
      name: name,
      description: description,
      date: Date.now(),
      author: webId,
      points: points
    }
    
    storageHelper.saveRoute(webId, route);
  }

  return (
    <AddRouteHolder>
      <RouteFields {...{ onSave }} />

      <Map {...{ onPointAdded }}
        googleMapURL={googleMapURL}
        loadingElement={<MapHolder />}
        containerElement={<MapHolder />}
        mapElement={<MapHolder />}
      />
    </AddRouteHolder>
  );
};

export default AddRoutePage;
// //GEOFENCE NOTES


// //Charlie's geofence notes 

// d is the distance between the two points (along a great circle of the sphere; see spherical distance),
// r is the radius of the 
// : latitude of point 1 and latitude of point 2
// : longitude of point 1 and longitude of point 2

// JavaScript:

// function deg2rad(deg) {
//   return deg * (Math.PI/180)
// }

// function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
//   var R = 6371; // Radius of the earth in km
//   var dLat = deg2rad(lat2-lat1);  // deg2rad below
//   var dLon = deg2rad(lon2-lon1);
//   var a = 
//     Math.sin(dLat/2) * Math.sin(dLat/2) +
//     Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
//     Math.sin(dLon/2) * Math.sin(dLon/2)
//     ; 
//   var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
//   var d = R * c; // Distance in km
//   return d;
// }
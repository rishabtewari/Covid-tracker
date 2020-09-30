import React,{useState,useEffect} from 'react';
import {
  MenuItem,
  FormControl,
  Select,
  Card,
  CardContent,
} from '@material-ui/core';
import InfoBox from './InfoBox';
import Table from './Table';
import './App.css';
import {sortData,prettyPrintStat} from './util';
import LineGraph from './LineGraph';
import Map from './Map';
import "leaflet/dist/leaflet.css"
function App() {
  const [countries , setCountries]=useState([]);
  const [country, setCountry]=useState("worldwide");
  const [countryInfo , setCountryInfo] = useState({}); 
  const [tableData , setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries , setMapCountries]= useState([]);
  const [casesType ,setCasesType]=useState("cases");
  console.log(casesType );
  useEffect(() => {
     fetch('https://disease.sh/v3/covid-19/all')
     .then(response => response.json())
     .then(data =>{
       setCountryInfo(data);
     })
  }, [])
  useEffect(() => {
    const getCountriesData = async()=>{
      await fetch("https://disease.sh/v3/covid-19/countries")
       .then((response)=> response.json())//just take a json from it from entire response
       .then((data)=>{
            const countries = data.map((country)=>(
              {
                name:country.country,
                value:country.countryInfo.iso2
              }
            ));
            const sortedData = sortData(data);
            setTableData(sortedData);
            setMapCountries(data);
            setCountries(countries);
       })
    }
    getCountriesData();
  }, []);

  const onCountryChange= async (e)=>{
    const countryCode = e.target.value;
    
    const url = countryCode === 'worldwide'?'https://disease.sh/v3/covid-19/all' :`https://disease.sh/v3/covid-19/countries/${countryCode}`;
    await fetch(url)
    .then(response =>response.json())
    .then(data =>{
      setCountry(countryCode);
       setCountryInfo(data);
       setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(4);
    })
  }
  return (
    <div className="App">
      <div className="app__left">
      <div className="app__header">
            <h1>COVID-19TRACKER</h1>
            <FormControl className="app__dropdown">
               <Select
                  variant="outlined"
                  value={country}
                  onChange={onCountryChange}
                >

                  {/* LOOP THROUGH ALL THE COUNTRIES */}
                  <MenuItem value="worldwide">Worldwide</MenuItem>
                  {
                    countries.map(country=>(
                    <MenuItem value={country.value}>{country.name}</MenuItem>
                    ))
                  }
                 {/*<MenuItem value="worldwide">worldwide</MenuItem>
                 <MenuItem value="worldwide">Option two</MenuItem>
                 <MenuItem value="worldwide">option 3</MenuItem>
                 <MenuItem value="worldwide">YOOOOOO</MenuItem>
                */}
                 </Select>
            </FormControl>
      </div>
        
      <div className="app__stats">
           {/* InfoBoxes */}
           <InfoBox 
           onClick={(e)=> setCasesType("cases")}
           title="Coronavirus cases" 
           active= {casesType === "cases"}
           
           cases={prettyPrintStat(countryInfo.todayCases)} 
           total={countryInfo.cases}>

           </InfoBox>
           {/* InfoBoxes */}
           <InfoBox onClick={(e) => setCasesType("recovered")} title="Recovered" active= {casesType === "recovered"}  cases={prettyPrintStat(countryInfo.todayRecovered)} total={countryInfo.recovered}></InfoBox>
           {/* InfoBoxes */}
           <InfoBox onClick={(e) => setCasesType("deaths")} title="Deaths" active= {casesType === "deaths"}  cases={prettyPrintStat(countryInfo.todayDeaths)} total={countryInfo.deaths}></InfoBox>
      </div>
        {/* Header  */}
        {/* Title + select input dropdown field  */}


       <Map 
       casesType={casesType}
       countries={mapCountries}
       center={mapCenter}
       zoom={mapZoom}
       />
        {/* Table */}
        {/* Graphs */}


        {/* Map */}
    </div>
      <Card className="app__right">
        <CardContent>
            <h3>Live Cases by Country</h3>
            <Table countries={tableData}/>
            <h3>WorldWide new cases</h3>
            <LineGraph casesType={casesType}/>
        </CardContent>
    </Card>
    </div>
     
  );
}

export default App;

import React from 'react'
import './infoBox.css'
import {Card,CardContent,Typography} from '@material-ui/core';
function InfoBox({title,cases,total,active,isRed, ...props}) {
    return (
        
        <Card onClick={props.onClick} className={`infoBox ${active && "infoBox--selected"} ${
            isRed && "infoBox--red"
          }`}>
            <CardContent>
                <Typography className="infoBox__title" color="textSecondary">{title}</Typography>
                 <h2 className="infoBox__cases">{cases}</h2>
             
                 {/* Tiltle */}
                 <Typography className="infoBox__total" color="textSecondary">{total} Total </Typography>
            </CardContent>
             
        </Card>
    )
}

export default InfoBox;
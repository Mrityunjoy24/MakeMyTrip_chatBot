// /**
//  * Copyright 2020 Quantiphi, Inc. All Rights Reserved.
//  *
//  * Licensed under the Apache License, Version 2.0 (the "License");
//  * you may not use this file except in compliance with the License.
//  * You may obtain a copy of the License at
//  *
//  *    http://www.apache.org/licenses/LICENSE-2.0
//  *
//  * Unless required by applicable law or agreed to in writing, software
//  * distributed under the License is distributed on an "AS IS" BASIS,
//  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//  * See the License for the specific language governing permissions and
//  * limitations under the License.
//  */

"use strict";

/**
 * Default Welcome Intent controller
 * @param {object} df webhook fulfillment object
 */
var nodemailer = require('nodemailer');
const db = require("../../helper/dbconnectivity");
const { GetEmailPhone } = require("../intent-mapper");
const chooseCarYes = async (df) => {
    
        let contexts = df._request.queryResult.outputContexts;
        let agent = contexts.find(item => item.name.endsWith('/contexts/awaiting_service'));
        var email = agent.parameters["email"];
        let carBrand = agent.parameters["cars_brand"];
        let carType = agent.parameters["Car_Type"];
        let carDur = agent.parameters.duration.amount;



        const carsRef = db.collection('Cars');
        const queryRef = await carsRef.where('brand', '==', carBrand).where('type','==',carType).get();

        let price;

        queryRef.forEach(doc => {
            console.log(doc.data());
            price = doc.data().price;
        });

        let c = price * carDur;
        let cost = c.toString();
        //console.log(cost);




        var summary = "Car Booking Summery:" + carBrand + " " + carType + "" + "price rate per hour: " + price + " total payable amount:"+cost;
        await db.collection("users").doc(email).update({
            'car': summary,
            'car_price': cost
        });

        


        
        df.setResponseText(summary);
        await db.collection('users').doc(email).get()
        .then(async (doc)=>{
          var flight=doc.data().flight;
          var car=doc.data().car;
          var hotel=doc.data().hotel;
          let total_cost=parseInt(doc.data().flight_price)+parseInt(doc.data().hotel_price)+parseInt(doc.data().car_price);
          var text="Flight Booking Details:"+flight+"\r\n"+"Hotel Booking Details:"+hotel+"\r\n"+"Car Booking Details:"+car+"\r\n"+" total_cost:"+total_cost;
          var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'your email',
              pass: 'your password'
            }
          });
          
          var mailOptions = {
            from: 'your email',
            to: email,
            subject: 'MakeMyTrip Bookings',
            text: text
          };
          
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });
          df.setResponseText("Flight Booking Details:"+flight+"Hotel Booking Details:"+hotel+"Car Booking Details:"+car+" total_cost:"+total_cost);
         
         
        });         

        
        


};

module.exports = chooseCarYes;

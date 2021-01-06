/**
 * Copyright 2020 Quantiphi, Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

"use strict";

/**
 * Default Welcome Intent controller
 * @param {object} df webhook fulfillment object
 */

const db = require("../../helper/dbconnectivity");
const roundTripYes = async (df) => {

    let contexts = df._request.queryResult.outputContexts;
    let agent = contexts.find(item => item.name.endsWith('/contexts/awaiting_service'));

    var email = agent.parameters['email'];
    var date = agent.parameters['roundtrip_date'].split("T")[0];
    var time = agent.parameters['time'].split("T")[1].split("+")[0];
    var S = "";
    var D = "";
    var P = 0;
    let up_date;
    var up = "Flight booking summary(Round-Trip):"
    await db.collection('users').doc(email).get()
        .then(async (doc) => {
            var source = doc.data().source;
            var destination = doc.data().destination;
            up_date=doc.data().date;
            up += date + " " + source + " to " + destination;
            S = source;
            D = destination;

        });



    await db.collection('Flights').where('source','==',S).where('destination','==',D).get()
        .then((snapshot) => {
            snapshot.forEach((doc) => {
                if (doc.data().date == up_date) {
                    //console.log(doc.data().Flightid)
                    var flightno = doc.data().Flightid;
                    //console.log(doc.data().name);
                    var flightname = doc.data().name;
                    //console.log(doc.data().price);
                    var price = doc.data().price;
                    up += flightno + flightname + price;
                    P = price;
                }
            });
        });



    // var date = agent.parameters["date"].split("T")[0];
    // var email = agent.parameters['email'];
    // await db.collection('users').doc(email).get()
    //     .then((doc) => {
    //         if (new Date(doc.data().date) > new Date(date)) {
    //             df.setResponseText("Round trip date should be greater");
    //         }
    //     });
    var result = "";
    var total_price = 0;
    await db.collection('Flights').get()
        .then(async (snapshot) => {

            snapshot.forEach((doc) => {
                let flightname = doc.data().name;
                let source = doc.data().source;
                let destination = doc.data().destination;
                let flightno = doc.data().Flightid;
                let price = doc.data().price;
                if (doc.data().date == date && doc.data().source == D && doc.data().destination == S) {
                total_price = parseInt(P) + parseInt(doc.data().price);
                var val = flightname + "\n" + flightno + "\n" + date + "\n" + doc.data().time + "Total Price:" + total_price;
                result = val;
                }
            });
            if (result == "") {
                df.setResponseText("NO Time slots available for " + date + D + " to " + S
                    + ":" + " Please choose another date.");
            }
            else {
                var discounted_price = total_price * 95 / 100;
                var downtrip = "(Down Trip)" + result;
                var summery = up + downtrip + "\n" + "Total Payable ammount: " + discounted_price;
                await db.collection("users").doc(email).update({
                    'flight': summery,
                    'flight_price': discounted_price
                });
                df.setResponseText(summery);
                df.setResponseText("lets book hotel");
            }
        });

}

module.exports = roundTripYes;
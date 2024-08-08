import React, { useEffect, useState } from 'react'
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { PDFViewer } from '@react-pdf/renderer';
import { Font } from '@react-pdf/renderer';
import timesBold from '../fonts/timesBold.ttf'
import { Image } from '@react-pdf/renderer'
import { useLocation, useParams, useSearchParams } from 'react-router-dom';
import { db, auth } from '../config/config';
import { collection, doc, addDoc } from 'firebase/firestore';
import { Button } from '@mui/material';
// Create styles
Font.register({
    family: 'timesBold',
    fonts: [
        { src: timesBold },
    ]
})

const styles = StyleSheet.create({
    page: {

        marginTop: 10,
        fontFamily: 'Times-Roman',
        flexDirection: "column",
        padding: " 0px 40px",
        alignItems: 'center',
    },
    section: {

        fontFamily: "timesBold",
        letterSpacing: 0.4,
        fontSize: 16,
        justifyContent: 'center',
        alignItems: 'center',

        lineHeight: 1.3
    },
    viewer: {
        width: window.innerWidth, //the pdf viewer will take up all of the width and height
        height: window.innerHeight,
    },
    header: {
        margin: 20,
        flexDirection: "column",
    },
    regular: {
        letterSpacing: 0.4,

        fontFamily: 'timesBold',
        fontSize: 12,
        margin: "5px 5px",

    },
    body: {
        fontSize: 14,
        margin: "0px 20px",
    },
    bold: {
        fontFamily: 'timesBold'
    }


});


// Create Document Component
const MyDocument = ({ questionPaperobj, ...props }) => {




    // const questionPaperobj = {
    //     examName: "T.Y.B.Tech.(ECT)(Semeseter-VI) Examination, September - 2015",
    //     subject: "VLSI DESIGN(Credit System)",
    //     subjectCode: '59980',
    //     date: "12 Jun 2016",
    //     marks: '100',
    //     instruction: ["This is just test instruction", "Another test instruction"],
    //     questions: {
    //         1: [
    //             {
    //                 question: "This is just sample question? This is just sample question? i) Google ii) Youtube",
    //                 marks: '10',
    //                 type: "MCQ",
    //                 a: "This is just sample question? ",
    //                 b: "This is just sample question? ",
    //                 c: "This is just sample question? ",
    //                 d: 'This is just sample question? '
    //             },
    //             {
    //                 question: "This is just another sample question?",
    //                 marks: '10',
    //                 figureUrl: "https://d39460vivz6red.cloudfront.net/questions/ph-bb-selina9-ch2-ex2B-q32/images/1_1600065288920.png"
    //             }
    //         ],
    //         2: [
    //             {
    //                 question: "This is just sample question?",
    //                 marks: '10',
    //                 figureUrl: 'https://d39460vivz6red.cloudfront.net/questions/ph-bb-selina9-ch2-ex2B-q32/images/1_1600065288920.png'
    //             },
    //             {
    //                 question: "This is just another sample question?",
    //                 marks: '10',
    //             }
    //         ],
    //       
    //     }
    // }


    const question = () => {
        let temp = []
        let questionRef = questionPaperobj.questions
        let idx = 1
        for (let i in questionRef) {
            let arr = []

            for (let j in questionRef[i]) {
                let ref_q = questionRef[i][j]

                if (ref_q != undefined) {
                    arr.push((
                        <View style={{ flexDirection: 'row', fontSize: 14, justifyContent: 'space-between', marginBottom: 10 }} >
                            <View style={{ flexDirection: "row", width: "100%" }}>
                                <Text> {String.fromCharCode(parseInt(j) + 97)}) </Text>
                                <View style={{ flexDirection: 'column' }}>
                                    <Text >{ref_q.question}</Text>
                                    {
                                        ref_q.figureUrl ? <Image style={{
                                            width: 100,
                                            height: 100,
                                        }}
                                            src={ref_q.figureUrl}
                                        /> : null
                                    }
                                    {
                                        ref_q.type == "MCQ" ? <View style={{ flexDirection: 'column', margin: 10 }}>

                                            <Text>a) {ref_q.a}</Text>
                                            <Text>b) {ref_q.b}</Text>
                                            <Text>c) {ref_q.c}</Text>
                                            <Text>d) {ref_q.d}</Text>


                                        </View> : null
                                    }

                                </View>
                            </View>
                            <Text style={{ marginLeft: 20, ...styles.bold }}>[{ref_q.marks}]</Text>
                        </View>
                    ))
                }
            }

            const v = (<View style={{ flexDirection: 'row', margin: "10px 10px" }}>
                <Text style={styles.bold}>Q {idx})  </Text>
                <View>
                    {arr.map(element => {
                        return element
                    })}
                </View>
            </View>)

            temp.push(v)
            idx += 1
        }

        return temp
    }

    return (
        < Document >
            {/*render a single page*/}
            < Page size="A4" style={styles.page}>
                <View style={styles.header}>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 5, marginHorizontal: 20 }}>
                        <View style={{ border: '1px solid black', width: 160, flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ borderRight: '1px solid gray', textAlign: 'center', width: 40, ...styles.regular, margin: 0 }}>Seat No.</Text>
                            <Text style={{ flex: 1 }}></Text>

                        </View>
                        <View style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                            <Text style={{ fontSize: 28, fontFamily: 'timesBold' }}>{questionPaperobj.paperCode}</Text>
                            <Text style={styles.regular} render={({ pageNumber, totalPages }) => (
                                `Total No. of Pages: ${totalPages}`
                            )} fixed />
                        </View>

                    </View>
                    <View style={styles.section}>
                        <Text>{questionPaperobj.examName}</Text>
                        <Text>{questionPaperobj.subject}</Text>
                        <Text>Sub. Code:{questionPaperobj.subjectCode}</Text>
                    </View>

                    <View style={{ margin: "0px 20px", padding: "20px 0px", }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', ...styles.regular }}>
                            <Text>Day and Date: {questionPaperobj.dateTime}</Text>
                            <Text>Total Marks: {questionPaperobj.totalMarks}</Text>
                        </View>
                        <View style={{ ...styles.regular }}>
                            <Text>Time: 10.00 a.m. to 01.00 p.m.</Text>
                        </View>
                        <View style={{ flexDirection: 'row', ...styles.regular }}>
                            <Text> Instruction: </Text>
                            <View>
                                {questionPaperobj.instruction.map((element, index) => {
                                    return <Text> {index + 1}) {element}</Text>
                                })}
                            </View>
                        </View>
                    </View>


                    <View style={styles.body}>
                        {question()}
                    </View>
                </View>
            </Page >
        </Document >
    );
}


function PdfViewer(props) {

    let queryString = window.location.href
    let set_id = queryString.split("=")[1]

    let paper = JSON.parse(localStorage.getItem("papers"))[set_id]
    let info = JSON.parse(localStorage.getItem("info"))
    let uid = ""
    let d_id = ""
    let paperOjbect = {}


    const location = useLocation()
    // location state is null if we try to access after generate 
    if (location.state != null) {
        const { from, id } = location.state
        uid = auth.currentUser.uid
        d_id = id
        paperOjbect = from
    } else {

        let from = {}
        paper.map((item, index) => {
            from[index] = item
        })

        d_id = localStorage.getItem("id")
        uid = localStorage.getItem("uid")
        paperOjbect = { ...info, "questions": from }
    }





    const storeData = async () => {
        const docRef = collection(db, "Collage", uid, "Subject", d_id.replace("_", " "), "Paper")
        await addDoc(docRef, paperOjbect)
        alert("Paper stored")
    }
    return (
        <div>
            <PDFViewer style={{ width: '100vw', height: '88vh' }}>
                <MyDocument questionPaperobj={paperOjbect} />

            </PDFViewer>


            {d_id ? <Button onClick={storeData} variant="contained"> Save as backup </Button> : null}
        </div>
    )
}

export default PdfViewer

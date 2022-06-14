const CURRENT_SCHOOL_YEAR: string = process.env.CURRENT_SCHOOL_YEAR || "";
import aws = require("aws-sdk");
import nodemailer = require("nodemailer");

// const ses = new aws.SES({ region: "us-west-2" });

const getCourseName = function (courseDict: any) {
    const { session, department, number, section } = courseDict;
    return `${session} ${department} ${number} ${section}`;
}

const getCourseURL = function (courseDict: any) {
    const { session, department, number, section } = courseDict;
    const year = parseInt(CURRENT_SCHOOL_YEAR) + (session == 'W' ? 0 : 1)
    return `https://courses.students.ubc.ca/cs/courseschedule?sesscd=${session}&pname=subjarea&tname=subj-section&sessyr=${year}&dept=${department}&course=${number}&section=${section}`
}

const sendEmail = async function (emails: Array<string>, title: string, description:string, courseURL: string, restricted: boolean) {
    // const params = {
    //     Destination: {
    //     ToAddresses: emails,
    //     },
    //     Message: {
    //     Body: {
    //         Text: { Data: `There is a ${restricted ? `restricted ` : ``}seat available for ${title} - ${description}\n\n${courseURL}` },
    //     },

    //     Subject: { Data: `Let Me In UBC: A seat has opened up for ${title}` },
    //     },
    //     Source: "letmeinubc@gmail.com",
    // };
    
    // return ses.sendEmail(params).promise()
    const transporter = nodemailer.createTransport(
        {
            service: 'gmail',
            auth: {
                user: process.env.EMAILER_USER,
                pass: process.env.EMAILER_PASS,
            }
    });

    var mailOptions = {
        from: 'letmeinubc@gmail.com',
        to: emails.join(", "),
        subject: `Let Me In UBC: A seat has opened up for ${title}`,
        text: `There is a ${restricted ? `restricted ` : ``}seat available for ${title} - ${description}\n\n${courseURL}`
    };

    const response = await transporter.sendMail(mailOptions);
    console.log(response);

    return response;
}

interface courseDict {
    title: string,
    description: string,
    session: string,
    department: string,
    number: string,
    section: string,
    restricted_only: boolean
}

exports.handler = async function (event: any) {
    const toNotify = event.data;
    for (let notifyDict of toNotify) {
        const emails: Array<string> = notifyDict["emails"];
        const courseDict: courseDict = notifyDict["course"];

        // const courseName: string = getCourseName(notifyDict["course"]);
        const courseURL: string = getCourseURL(notifyDict["course"]);
        
        await sendEmail(emails, courseDict['title'], courseDict['description'], courseURL, courseDict['restricted_only']);
    }
    return event.data
};

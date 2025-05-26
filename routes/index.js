import express from 'express';
import dotenv from 'dotenv';
import { SignJWT } from 'jose';
import { typeOfProblemObject } from "./helper.js";

dotenv.config();
const router = express.Router();

const createJwtToken = async () => {
  const iat = Math.floor(Date.now() / 1000); // Current time in epoch seconds
  const payload = {
    iss: process.env.NOTIFY_SERVICE_ID_ISS,
    iat: iat,
  };

  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt(iat)
    .sign(new TextEncoder().encode(process.env.NOTIFY_SECRET_KEY));

  return token;
};

/* GET home page. */
router.get('/', (req, res) => {
  req.session.formData = {};
  res.render('main/index');
});

/* GET request form page */
router.get('/step-1', (req, res) => {
  const formData = req.session.formData || {};
  res.render('main/step_1', {formData});
});

/* POST request form page (Validation) */
router.post('/step-1', (req, res) => {
  const { yourName, typeOfProblem, email, moreDetail } = req.body;
  const confirmation_id = Math.floor(Math.random() * 1000);
  let errors = [];

  if (!yourName || yourName.trim() === "") {
    errors.push({ text: "How many times do we have to teach you this lesson, old man!", href: "#your-name" });
  }

  if (!typeOfProblem) {
    errors.push({ text: 'What was the reason for the "rubber duck" request?', href: "#typeOfProblem" });
  }

  if (!email || email.trim() === "") {
    errors.push({ text: "This isn't an email dude", href: "#email" });
  }


  // If there are errors, re-render form with errors
  if (errors.length > 0) {
    req.session.formData = { yourName, typeOfProblem, email, moreDetail };
    return res.render('main/step_1', { errors, yourName, typeOfProblem, email });
  }

  req.session.formData = { yourName, typeOfProblem, problemDescription: typeOfProblemObject[typeOfProblem], email, moreDetail, confirmation_id };

  res.redirect('/check-answers');
});

/* GET check answers page. */
router.get('/check-answers', (req, res) => {
  const formData = req.session.formData;

  res.render('main/check_answers', {formData});
});

/* GET step 3 page. */
router.get('/step-3', (req, res) => {
  res.render('main/step_3');
});

/* GET notify page. */
router.get('/notify', async (req, res) => {
  const formData = req.session.formData;
  const templateId = process.env.NOTIFY_TEMPLATE_ID;

  let jwtToken;

  // Make the API call using JWToken
  try {
    const jwtToken = await createJwtToken();
    const response = await req.axiosMiddleware.post(
      'https://api.notifications.service.gov.uk/v2/notifications/email',
      {
        email_address: formData.email,
        template_id: templateId,
        personalisation: { 
          name: formData.yourName, 
          typeOfProblem: formData.problemDescription, 
          moreDetail: formData.moreDetail || "No additional information entered"
        }, 
      },
      {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          'Content-type': 'application/json',
        },
      }
    );

    console.log('Email sent:', response.data);
    res.render('main/notify', { formData, message: 'Successfully sent e-mail.' });
  } catch (error) {
    console.log(`token: '${jwtToken}'`)
    console.error('Error sending email:', error.response ? error.response.data : error.message);
    res.render('main/notify', { formData, message: 'Failed to send e-mail.' });
  }
});


export default router;

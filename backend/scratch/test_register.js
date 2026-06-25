const axios = require('axios');

async function run() {
  try {
    console.log('1. Fetching health...');
    const healthRes = await axios.get('http://127.0.0.1:5000/api/v1/health');
    console.log('Health:', healthRes.data);

    console.log('2. Requesting OTP...');
    const otpRes = await axios.post('http://127.0.0.1:5000/api/v1/auth/request-otp', {
      phone: '9876543210'
    });
    console.log('OTP:', otpRes.data);

    console.log('3. Verifying OTP...');
    const verifyRes = await axios.post('http://127.0.0.1:5000/api/v1/auth/verify-otp', {
      phone: '9876543210',
      otp: '123456'
    });
    console.log('Verify:', verifyRes.data);

    const token = verifyRes.data.data.tokens.accessToken;
    console.log('Got Token:', token);

    console.log('4. Registering draft profile...');
    const registerRes = await axios.post('http://127.0.0.1:5000/api/v1/register', {
      personal: {
        firstName: 'Test',
        lastName: 'User',
        dob: '1990-01-01',
        gender: 'Male',
        phone: '9876543210',
        email: 'test@example.com'
      },
      address: {
        streetAddress: '123 Test St',
        city: 'Mumbai',
        district: 'Mumbai',
        state: 'Maharashtra',
        pinCode: '400001'
      },
      jobPreferences: {
        categories: ['Construction'],
        salaryRange: '₹10,000 - ₹15,000',
        shiftPreference: 'Day',
        immediatelyAvailable: true,
        willingToRelocate: false
      },
      education: {
        highestLevel: 'Secondary (10th Pass)'
      },
      experience: []
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    console.log('Register Success:', registerRes.data);
  } catch (error) {
    console.error('Error during flow:', error.response ? error.response.data : error.message);
  }
}

run();

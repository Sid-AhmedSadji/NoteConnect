import { connectDB } from '../config/db.js';
import config from '../config/env.js';
import { Check } from '@noteconnect/models';
import { apiResponse, CustomError, getSchemaByDomain } from '@noteconnect/utils';
import { ObjectId } from 'mongodb';

const checkCollectionName = "Checks";

const getChecks = async (req, res, next) => {
  try {
    const client = await connectDB();
    const collection = client.collection(checkCollectionName);
    const checks = await collection.find({success:null}).toArray();
    apiResponse(res, 200, 'success', 'Checks fetched successfully', checks);
  } catch (error) {
    if (config.NODE_ENV === 'development') console.error('Error fetching checks:', error);
    next(error);
  }
};

const getChecksPending = async (req, res, next) => {
  try {
    const client = await connectDB();
    const collection = client.collection(checkCollectionName);
    const checks = await collection.find({ success: null }).toArray();
    apiResponse(res, 200, 'success', 'Pending checks fetched successfully', checks);
  } catch (error) {
    if (config.NODE_ENV === 'development') console.error('Error fetching checks:', error);
    next(error);
  }
};

const validateCheck = async (req, res, next) => {
  try {
    const checkId = new ObjectId(req.params.id);
    const client = await connectDB();
    const collection = client.collection(checkCollectionName);
    const checkData = await collection.findOne({ _id: checkId });

    const success = req.body.success;
    if ( !success ) {
        throw new CustomError({
            statusCode: 400,
            name: 'Bad Request',
            message: 'Missing or invalid "success" field in request body'
        });
    }

    if (!checkData) {
        throw new CustomError({
            statusCode: 404,
            name: 'Not Found',
            message: 'Check not found'
        });
    }
    const check = new Check(checkData);
    // Perform validation logic here
    await collection.updateOne({ _id: checkId }, { $set: { success: success } });
    apiResponse(res, 200, 'success', 'Check validated successfully', check);
    } catch (error) {
    if (config.NODE_ENV === 'development') console.error('Error validating check:', error);
    next(error);
    }
};
export { getChecks, validateCheck, getChecksPending };
import { NextApiRequest, NextApiResponse } from 'next';
import Review from './model/ReviewSchema';
import { connectToDatabase } from '../../../Utils/mongodb';

const saveReview = async (req: any, res: any) => {
    try {
        await connectToDatabase();
        // TODO: Need to take revieweeId from token which user is login
        // if not then send error response

        const reviewInfo = req.body;

        // check if reviewer already give review to user
        const isReviewExistGivenByRevieweer = await Review.findOne({
            revieweeId: reviewInfo.revieweeId,
            reviewerId: reviewInfo.reviewerId,
        });

        if (isReviewExistGivenByRevieweer) {
            return res.json({
                code: 400,
                status: 'error',
                error: 'You already give review for this user',
            });
        }
        // TODO:
        // need to check if reviewer is current or previous colleague
        // if yes then user can give review else can not give review

        await Review.create(reviewInfo);

        return res.json({ code: 201, status: 'success', message: ' Review given successfully.' });
    } catch (e) {
        console.log(e);

        return res.json({
            code: 500,
            status: 'error',
            error: e,
        });
    }
};
export default async function handler(req: NextApiRequest, res: any) {
    const { method } = req;
    switch (method) {
        case 'POST':
            /**
             * @swagger
             * '/api/reviews':
             *  post:
             *     tags:
             *     - Reviews
             *     summary: Create a user review
             *     requestBody:
             *      required: true
             *      content:
             *        application/json:
             *           schema:
             *            type: object
             *            properties:
             *              revieweeId:
             *                type: string
             *                default: 6304b9e894a8c241d9705c3b
             *              reviewerId:
             *                type: string
             *                default: 6304b9e894a8c241d9705c3c
             *              pros:
             *                type: string
             *                default: Good knowledge about javascript
             *              cons:
             *                type: string
             *                default: Old school
             *     responses:
             *      201:
             *        description: Created
             */

            return await saveReview(req, res);
            break;
        default:
            res.status(400).json({ success: false });
            break;
    }
}

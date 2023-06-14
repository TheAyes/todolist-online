import mongoose from "mongoose";

export interface IStatistics extends mongoose.Document {
	interactionCount: number;
}

const StatisticsSchema = new mongoose.Schema({
	interactionCount: {
		type: Number,
		required: false,
	}
});

export const Statistics = mongoose.model<IStatistics>("Statistics", StatisticsSchema);
import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    requirements: {
        type: [String],
        required: true
    },
    salary: {
        type: Number,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    jobType: {
        type: String,
        required: true
    },
    experienceLevel: {
        type: String,
        required: true
    },
    position: {
        type: Number,
        required: true
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true
    },
    applications: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Application'
    }],
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Add a virtual field to check if a user has applied
jobSchema.virtual('hasApplied').get(function() {
    if (!this.applications || !this._requestUserId) return false;
    return this.applications.some(app => 
        app.applicant && app.applicant._id.toString() === this._requestUserId.toString()
    );
});

// Middleware to set the requesting user's ID
jobSchema.pre('find', function(next) {
    if (this.options && this.options.userId) {
        this._requestUserId = this.options.userId;
    }
    next();
});

jobSchema.pre('findOne', function(next) {
    if (this.options && this.options.userId) {
        this._requestUserId = this.options.userId;
    }
    next();
});

export const Job = mongoose.model("Job", jobSchema);
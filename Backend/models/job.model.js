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
    },
    expirationDate: {
        type: Date,
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

// Add a virtual field to check if job is expired
jobSchema.virtual('isExpired').get(function() {
    return new Date() > this.expirationDate;
});

// Add a virtual field to get days remaining
jobSchema.virtual('daysRemaining').get(function() {
    const now = new Date();
    const expiration = new Date(this.expirationDate);
    const diffTime = expiration - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
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
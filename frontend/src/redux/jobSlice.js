import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    allJobs: [],
    searchText: "",
    adminJobs: [],
    searchAdminJobs: "",
    singleJobById: null,
    jobStats: {
        totalJobs: 0,
        activeJobs: 0,
        expiredJobs: 0
    }
};

const jobSlice = createSlice({
    name: "job",
    initialState,
    reducers: {
        setAllJobs: (state, action) => {
            state.allJobs = action.payload;
        },
        setSearchText: (state, action) => {
            state.searchText = action.payload;
        },
        setAdminJobs: (state, action) => {
            state.adminJobs = action.payload;
        },
        setSearchAdminJobs: (state, action) => {
            state.searchAdminJobs = action.payload;
        },
        setSingleJobById: (state, action) => {
            state.singleJobById = action.payload;
        },
        setJobStats: (state, action) => {
            state.jobStats = action.payload;
        }
    }
});

export const { setAllJobs, setSearchText, setAdminJobs, setSearchAdminJobs, setSingleJobById, setJobStats } = jobSlice.actions;
export default jobSlice.reducer;
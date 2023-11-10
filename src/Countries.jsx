import React, { useEffect, useState, useMemo, useCallback } from 'react';
import axios from 'axios';
import { Box, AppBar, Button, Toolbar, Typography, TextField } from "@mui/material";
import './Countries.css';

function Countries() {
    const [button, setButton] = useState(false);
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [view, setView] = useState("grid");
    const [searchQuery, setSearchQuery] = useState("");

    const fetchData = useCallback(() => {
        if (button) {
            axios.get("https://restcountries.com/v3.1/all")
                .then((res) => {
                    console.log(res.data);
                    setData(res.data);
                    setIsLoading(false);
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }, [button]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const sortedData = useMemo(() => {
        switch (view) {
            case 'grid':
                return data;
            case 'list':
                return [...data].sort((a, b) => a.name.common.localeCompare(b.name.common));
            default:
                return data;
        }
    }, [data, view]);

    const handleSortBy = useCallback((sortingFunction) => {
        setData([...data].sort(sortingFunction));
    }, [data]);

    const ascName = useCallback(() => {
        handleSortBy((a, b) => a.name.common.localeCompare(b.name.common));
    }, [handleSortBy]);

    const desName = useCallback(() => {
        handleSortBy((a, b) => b.name.common.localeCompare(a.name.common));
    }, [handleSortBy]);

    const ascPop = useCallback(() => {
        handleSortBy((a, b) => a.population - b.population);
    }, [handleSortBy]);

    const desPop = useCallback(() => {
        handleSortBy((a, b) => b.population - a.population);
    }, [handleSortBy]);

    const setType = useCallback((newView) => {
        setView(newView);
    }, []);

    const handleSearchChange = useCallback((e) => {
        setSearchQuery(e.target.value);
    }, []);

    const filteredData = useMemo(() => {
        return sortedData.filter((c) =>
            c.name.common.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [sortedData, searchQuery]);

    return (
        <div>
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position='static'>
                    <Toolbar className='Toolbar'>
                        <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
                            <Button onClick={() => setButton(true)}>Fetch Countries</Button>
                        </Typography>

                        <div>
                            <h5>
                                Sort by Country{' '}
                                <Button
                                    type='button'
                                    className='button'
                                    onClick={ascName}
                                >
                                    Ascending
                                </Button>
                                {' '}
                                <Button
                                    type='button'
                                    className='button'
                                    onClick={desName}
                                >
                                    Descending
                                </Button>
                            </h5>
                        </div>

                        <div>
                            <h5>
                                Sort by Population{' '}
                                <Button
                                    type='button'
                                    className='button'
                                    onClick={ascPop}
                                >
                                    Ascending
                                </Button>
                                {' '}
                                <Button
                                    type='button'
                                    className='button'
                                    onClick={desPop}
                                >
                                    Descending
                                </Button>
                            </h5>
                        </div>

                        <div>
                            <h5>
                                Sort by View{' '}
                                <Button onClick={() => setType("list")}>List</Button>
                                {' '}
                                <Button onClick={() => setType("grid")}>Grid</Button>
                            </h5>
                        </div>
                    </Toolbar>
                </AppBar>
            </Box>
            <div>
                <br />
                <TextField type="text" placeholder='Search Country' value={searchQuery} onChange={handleSearchChange} />

                <h1>Countries</h1>
                <div>
                    {isLoading ? (
                        <img src="https://i.pinimg.com/originals/c7/e1/b7/c7e1b7b5753737039e1bdbda578132b8.gif" alt="" />
                    ) : (
                        <div className={view === "list" ? "list-view" : "grid-view"}>
                            {filteredData.map((c, i) => (
                                <div key={i} className={`styleview ${view === "grid" ? "grid-view" : ""}`}>
                                    <h2>{c.name.common}</h2>
                                    <img src={c.flags.svg} alt="" style={{ width: "200px", height: "auto" }} />
                                    <h4>Population: {c.population}</h4>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Countries;

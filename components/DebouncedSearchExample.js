import React, { useState, useEffect } from "react";

function DebouncedSearchExample() {
    const [query, setQuery] = useState("");
    const [searchResults, setSearchResults] = useState("Type to search...");

    // Debounce function implementation
    function debounce(func, delay) {
        let timeoutId;
        console.log(timeoutId, '-time id--')
        return function (...args) {
            console.log(...args, '--args--')
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                func.apply(this, args);
            }, delay);
            console.log(timeoutId, '-time id-2-')
        };

    }

    // Simulated search function
    function performSearch(query) {
        setSearchResults(`Searching for: ${query}`);
        // In a real application, you would make an API request here.
    }

    // Create a debounced search function
    const debouncedSearch = debounce(performSearch, 300);

    // Update search results when the query changes
    useEffect(() => {
        debouncedSearch(query);
    }, [query]);

    return (
        <div>
            <input style={{ color: "black", outline: "none", border: "none" }}
                type="text"
                placeholder="Search..."
                value={query}
                onChange={(event) => setQuery(event.target.value)}
            />
            <div>{searchResults}</div>
        </div>
    );
}

export default DebouncedSearchExample;

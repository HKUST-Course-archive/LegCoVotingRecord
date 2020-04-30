import React, { useState, useEffect } from 'react'
import data from '../Data/memberInfo.json'
import './GridSelect.css'

function MemberCard(props){
    var BackColor = props.value.political_stance === "Pro-Beijing"?"rgba(0,153,255,0.8)":"rgb(255, 255, 153,0.8)";
    return (
        <div className="Card" onClick={props.onClick}>
            <img src={props.value.photo_address} alt="profile picture"></img>
            <div style={{backgroundColor: BackColor}}>
                <p>{props.value.name_full}</p>
                <p>Constituency: {props.value.constituency}</p>
            </div>
        </div>
    )
}

function RecordPage(props){
    const [rawFilter, setRawFilter] = useState({
        MeetingType: "Council Meeting",
        VoteFilter: "All",
        TitleFilter: ""
    })
    //const [filter, setFilter] = useState(" and type eq 'Council Meeting'")
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [items, setItems] = useState([]);
    var url = "https://app.legco.gov.hk/vrdb/odata/vVotingResult?$filter=term_no eq 6 and substringof('"+props.name_en+"', name_en)&$orderby=vote_time desc"
    //const [urlState, setUrlState] = useState(url);
    // Note: the empty deps array [] means
    // this useEffect will run once
    // similar to componentDidMount()
    useEffect(() => {
        setIsLoaded(false)
        fetch(url)
            .then(res => res.json())
            .then(
                (result) => {
                    setIsLoaded(true);
                    setItems(result.value);
                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    setIsLoaded(true);
                    setError(error);
                }
            )
    }, [])

    let MainView;
    if (error) {
        MainView = <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
        MainView = <div className="Loader"></div>;
    } else if (items.length === 0) {
        MainView = <div>No record is found</div>
    }
    else {
        MainView = 
            <table className="RecordContainer">
                <thead><tr><th>Motions/Bills</th><th>Vote</th></tr></thead>
                <tbody>
                {items.filter(item => (
                    (rawFilter.MeetingType === "All"?true:rawFilter.MeetingType === item.type) && 
                    (rawFilter.VoteFilter === "All"?true:item.vote===rawFilter.VoteFilter) &&
                    (rawFilter.TitleFilter === ""?true:item.motion_en.toLowerCase().includes(rawFilter.TitleFilter.toLowerCase()))
                )).map(item => (
                    <tr key={item.id} className="Row">
                        <td className="MotionName">{item.motion_en}</td>
                        <td className="Vote" style={(item.vote==="Yes")?{backgroundColor:"green"}:(item.vote==="No")?{backgroundColor:"red"}:(item.vote==="Absent")?{color:"red"}:{}}>{item.vote}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        }
    
    function handleFilterChange(event){
        const target = event.target;
        const ChangeTarget = target.name;
        var MeetingType = rawFilter.MeetingType;
        var VoteFilter = rawFilter.VoteFilter;
        var TitleFilter = rawFilter.TitleFilter;
        if (ChangeTarget === "MeetingType"){
            MeetingType = target.value;
        }
        else if (ChangeTarget === "VoteFilter"){
            VoteFilter = target.value;
        }
        else {
            TitleFilter = target.value
        }
        setRawFilter({
            MeetingType: MeetingType,
            VoteFilter: VoteFilter,
            TitleFilter: TitleFilter
        })
        //var filterStr = "";
        //if (MeetingType !== "All") filterStr += " and type eq '" + MeetingType + "'"
        //if (VoteFilter !== "All") filterStr += " and vote eq '" + VoteFilter + "'"
        //setFilter(filterStr)
        //url = "https://app.legco.gov.hk/vrdb/odata/vVotingResult?$filter=term_no eq 6 and substringof('"+props.name_en+"', name_en)"+filterStr+"&$orderby=vote_time desc"
        //setUrlState(url)
    }

    const FilterBar = (<form className="FilterBar">
        <label htmlFor="MeetingType">Meeting Type</label>
        <select id="MeetingType" name="MeetingType" value={rawFilter.MeetingType} onChange={handleFilterChange}>
                <option value="All">All</option>
                <option value="Council Meeting">Council Meeting</option>
                <option value="Finance Committee">Finance Committee</option>
                <option value="House Committee">House Committee</option>
                <option value="Establishment Subcommittee">Establishment Subcommittee</option>
                <option value="Public Works Subcommittee">Public Works Subcommittee</option>
        </select>
        <label htmlFor="VoteFilter">Vote Filter</label>
        <select id="VoteFilter" name="VoteFilter" value={rawFilter.VoteFilter} onChange={handleFilterChange}>
            <option value="All">All</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
            <option value="Abstain">Abstain</option>
            <option value="Absent">Absent</option>
            <option value="Present">Present</option>
        </select>
        <label htmlFor="TitleFilter">Search</label>
        <input type="text" id="TitleFilter" name="TitleFilter" value={rawFilter.TitleFilter} placeholder="Filter text" onChange={handleFilterChange}/>
    </form>);

    return (
        <div>
            {FilterBar} 
            {MainView}
        </div>
        );
}

function GridSelect(props) {
    //const [Select, setSelect] = useState(null);
    const [Select, setSelect] = props.Select;
    const listOfPeople = data.map((value, i) => 
        <MemberCard value={value} key={i} onClick={()=>{setSelect(value.name_en)}}/>
    );
    if (Select == null){
        return (
        <div className="Grid">
            {listOfPeople}
        </div>
        )
    }
    else return(
        <RecordPage name_en={Select}/>
    )
}

export default GridSelect
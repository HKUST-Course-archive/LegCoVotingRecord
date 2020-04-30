import React, {useState, useEffect} from 'react'
import './GridSelect.css'

function Bills(){
    const [rawFilter, setRawFilter] = useState({
        MeetingType: "Council Meeting",
        TitleFilter: ""
    })
    //const [filter, setFilter] = useState(" and type eq 'Council Meeting'")
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [items, setItems] = useState([]);
    var url = "https://app.legco.gov.hk/vrdb/odata/vVotingResult?$filter=term_no eq 6 and (substringof('Chan Kin-por', name_en) or substringof('Starry Lee', name_en) or substringof('Holden chow', name_en) or substringof('Lo wai-kwok', name_en))&$orderby=vote_time desc&$select=id,vote_time,motion_ch,motion_en,vote_separate_mechanism,type,gc_yes_count,gc_no_count,gc_abstain_count,gc_result,fc_yes_count,fc_no_count,fc_abstain_count,fc_result,overall_yes_count,overall_no_count,overall_abstain_count,overall_result"
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
        var seenbills = {}
        MainView = 
            <table className="RecordContainer">
                <thead><tr><th>Motions/Bills</th><th>Statistc</th><th>Result</th></tr></thead>
                <tbody>
                {items
                .filter(function (item) {
                    if (item.vote_time in seenbills) return false;
                    else {
                        seenbills[item.vote_time] = true;
                        return true;
                    }
                })
                .filter(item => (
                    (rawFilter.MeetingType === "All"?true:rawFilter.MeetingType === item.type) && 
                    (rawFilter.TitleFilter === ""?true:item.motion_en.toLowerCase().includes(rawFilter.TitleFilter.toLowerCase()))))
                .map(item => (
                    <tr key={item.id} className="Row">
                        <td className="MotionName">{item.motion_en}</td>
                        <td className="Stat">
                            {item.vote_separate_mechanism==="Yes"?(
                                <div className="VotePair">
                                    <div className="FC"><span className="voteType" style={(item.fc_result==="Passed")?{backgroundColor: "green"}:{backgroundColor: "red"}}>F</span><span className="voteYes">{item.fc_yes_count}</span>/<span className="voteNo">{item.fc_no_count}</span>/{item.fc_abstain_count}</div>
                                    <div className="GC"><span className="voteType" style={(item.gc_result==="Passed")?{backgroundColor: "green"}:{backgroundColor: "red"}}>G</span><span className="voteYes">{item.gc_yes_count}</span>/<span className="voteNo">{item.gc_no_count}</span>/{item.gc_abstain_count}</div>
                                </div>):
                            <div className="Overall"><span className="voteYes">{item.overall_yes_count}</span>/<span className="voteNo">{item.overall_no_count}</span>/{item.overall_abstain_count}</div>
                            }
                        </td>
                        <td className="VoteResult" style={(item.overall_result==="Passed")?{backgroundColor: "green"}:{backgroundColor: "red"}}>{item.overall_result}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        }
    
    function handleFilterChange(event){
        const target = event.target;
        const ChangeTarget = target.name;
        var MeetingType = rawFilter.MeetingType;
        var TitleFilter = rawFilter.TitleFilter;
        if (ChangeTarget === "MeetingType"){
            MeetingType = target.value;
        }
        else {
            TitleFilter = target.value
        }
        setRawFilter({
            MeetingType: MeetingType,
            TitleFilter: TitleFilter
        })
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

export default Bills
import '../styling/TimeSlotTable.css';

const AddHeaderTitle = ({title}) => {
    return(
        <th key={title}>
            {title}
        </th>
    );
}

const TimeSlotElement = ({time, cols}) => {
    return (
        <>
            <tr>
                <td>{time}</td>
                {cols.map(() => <td/>)}
            </tr>
            <tr>
                <td/>
                {cols.map(() => <td/>)}
            </tr>
            <tr>
                <td/>
                {cols.map(() => <td/>)}
            </tr>
            <tr>
                <td/>
                {cols.map(() => <td/>)}
            </tr>
        </>
    );
}

const TimeSlotTable = ({headerTitles, times}) => {
    return (
        <div className="TimeSlotTable">
            <table className="styled-table">
                <thead>
                    <tr>
                        <th/>
                        {headerTitles.map(title => <AddHeaderTitle title={title}/>)}
                    </tr>
                </thead>
                <tbody>
                    {times && times.map(time => <TimeSlotElement time={time} cols={headerTitles}/>)}
                </tbody>
            </table>
        </div>
    );
}

export default TimeSlotTable;

/*
<thead>
                <tr>
                    <th>Name</th>
                    <th>Points</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>Dom</td>
                    <td>6000</td>
                </tr>
                <tr className="active-row">
                    <td>Melissa</td>
                    <td>5150</td>
                </tr>
                </tbody>
 */
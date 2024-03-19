import React from 'react';
import {Pie} from 'react-chartjs-2';

function PieChart({data}) {
    return (
        <div className="chart-container">
            <h2 style={{textAlign: "center"}}>Pie Chart</h2>
            <Pie
                data={data}
                options={{
                    plugins: {
                        title: {
                            display: true,
                            text: "Cars by type",
                        }
                    }
                }}
            />
        </div>
    )
}

export default PieChart;
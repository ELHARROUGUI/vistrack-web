import { useEffect, useState, useRef } from "react";
import { VictoryChart, VictoryLine, VictoryLabel, VictoryTheme } from "victory";
import { getInfos, createInfo } from "../../services/info";

export default function Welcome() {
  const [alert, setAlert] = useState(false);
  const [infos, setInfos] = useState([]);
  const [wInput, setWInput] = useState("");
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    if (infos.length && !alert) {
      return;
    }
    getInfos().then((items) => {
      if (mounted.current) {
        if (Array.isArray(items)) setInfos(items);
      }
    });
    return () => (mounted.current = false);
  }, [alert, infos]);

  useEffect(() => {
    if (alert) {
      setTimeout(() => {
        setAlert(false);
      }, 1000);
    }
  }, [alert]);

  const handleSubmit = (e) => {
    e.preventDefault();
    createInfo(wInput).then((res) => {
      console.log("res" + JSON.stringify(res));
      setWInput("");
      setAlert(true);
    });
  };

  return (
    <div className="App">
      <h1>Vistrack</h1>
      <div>
        {alert && <h2> Submit Successful</h2>}
        <form onSubmit={handleSubmit}>
          <h2>Add weight value</h2>
          <input
            type="text"
            onChange={(event) => setWInput(event.target.value)}
            value={wInput}
          />
          <button type="submit">submit</button>
        </form>
      </div>
      <ul>
        {infos.map((item) => (
          <li key={item.x}>{item.y}</li>
        ))}
      </ul>
      <VictoryChart minDomain={{ x: 0, y: 0 }} theme={VictoryTheme.material}>
        <VictoryLine
          interpolation="natural"
          labels={({ datum }) => datum.label}
          labelComponent={<VictoryLabel />}
          animate={{
            duration: 10000,
            onLoad: { duration: 5000 }
          }}
          style={{
            data: { stroke: "#c43a31" },
            parent: { border: "1px solid #ccc" }
          }}
          data={[
            { x: 1, y: 2, label: "A" },
            { x: 2, y: 3, label: "S" },
            { x: 3, y: 5, label: "Z" },
            { x: 4, y: 4, label: "E" },
            { x: 5, y: 7, label: "F" }
          ]}
        />
      </VictoryChart>
    </div>
  );
}

import { useEffect, useState, useRef } from "react";
import { VictoryChart, VictoryLine, VictoryLabel, VictoryTheme } from "victory";
import { getInfos, createInfo } from "../../services/info";

export default function Welcome() {
  const [alert, setAlert] = useState(false);
  const [infos, setInfos] = useState([]);
  const [xInput, setXInput] = useState(null);
  const [yInput, setYInput] = useState(null);
  const [maxX, setMaxX] = useState(100);
  const [minX, setMinX] = useState(0);
  const [maxY, setMaxY] = useState(100);
  const [minY, setMinY] = useState(0);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    if (infos.length && !alert) {
      return;
    }
    getInfos().then((items) => {
      if (mounted.current) {
        if (Array.isArray(items)) {
          setMaxX(Math.max(...items.map(({ x }) => x)));
          setMaxY(Math.max(...items.map(({ y }) => y)));
          setMinX(Math.min(...items.map(({ x }) => x)));
          setMinY(Math.min(...items.map(({ y }) => y)));

          setInfos(items);
        }
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
    createInfo({ x: xInput, y: yInput }).then((res) => {
      console.log("res" + JSON.stringify(res));
      setXInput(null);
      setYInput(null);
      setAlert(true);
    });
  };

  return (
    <div className="App">
      <h1>Vistrack</h1>
      {Array.isArray(infos) && infos.length && (
        <VictoryChart
          minDomain={{ x: minX - 10, y: minY - 10 }}
          maxDomain={{ x: maxX + 10, y: maxY + 10 }}
          theme={VictoryTheme.material}
        >
          <VictoryLine
            //interpolation="natural"
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
            data={infos
              .sort((info1, info2) => info1.x - info2.x)
              .map(({ x, y }) => ({ x, y, label: `(${x},${y})` }))}
          />
        </VictoryChart>
      )}
      <div>
        {alert && <h2> Submit Successful</h2>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="x"
            onChange={(event) => setXInput(event.target.value)}
            value={xInput}
          />
          <input
            type="text"
            placeholder="y"
            onChange={(event) => setYInput(event.target.value)}
            value={yInput}
          />
          <button type="submit" disabled={!(xInput && yInput)}>
            submit
          </button>
        </form>
      </div>
      <ul>
        {infos
          .sort((info1, info2) => info1.x - info2.x)
          .map((item) => (
            <li key={item.x}>
              ({item.x},{item.y})
            </li>
          ))}
      </ul>
    </div>
  );
}

"use client";
import styles from "./page.module.css";
import { ChangeEvent, useState } from "react";

const CFM_DEFAULT = 800;
const FRICTION_DEFAULT = 0.08;
const VARIANCE_DEFAULT = 0.02;

const GREEN = "GREEN";
const YELLOW = "YELLOW";
const RED = "RED";

const TUBE_DIMENSIONS = [
  [16, 3],
  [14, 3],
  [12, 3],
  [10, 3],
  [8, 3],
  [18, 4],
  [16, 4],
  [14, 4],
  [12, 4],
  [10, 4],
  [8, 4],
  [18, 5],
  [16, 5],
  [14, 5],
  [12, 5],
  [10, 5],
  [8, 5],
  [36, 6],
  [34, 6],
  [42, 6],
  [40, 6],
  [38, 6],
  [32, 6],
  [60, 6],
  [58, 6],
  [56, 6],
  [54, 6],
  [52, 6],
  [50, 6],
  [48, 6],
  [46, 6],
  [44, 6],
  [30, 6],
  [28, 6],
  [26, 6],
  [24, 6],
  [22, 6],
  [20, 6],
  [18, 6],
  [16, 6],
  [14, 6],
  [12, 6],
  [10, 6],
  [8, 6],
  [24, 8],
  [22, 8],
  [28, 8],
  [26, 8],
  [50, 8],
  [48, 8],
  [46, 8],
  [44, 8],
  [42, 8],
  [40, 8],
  [38, 8],
  [36, 8],
  [34, 8],
  [32, 8],
  [30, 8],
  [20, 8],
  [18, 8],
  [16, 8],
  [14, 8],
  [12, 8],
  [10, 8],
  [8, 8],
  [18, 10],
  [20, 10],
  [16, 10],
  [36, 10],
  [34, 10],
  [32, 10],
  [30, 10],
  [28, 10],
  [26, 10],
  [24, 10],
  [22, 10],
  [14, 10],
  [12, 10],
  [10, 10],
  [14, 12],
  [16, 12],
  [30, 12],
  [28, 12],
  [26, 12],
  [24, 12],
  [22, 12],
  [20, 12],
  [18, 12],
  [12, 12],
  [14, 14],
  [24, 14],
  [22, 14],
  [20, 14],
  [18, 14],
  [16, 14],
  [22, 16],
  [20, 16],
  [18, 16],
  [16, 16],
  [20, 18],
  [18, 18],
  [20, 20],
];

const PIPE_DIAMETERS = [5, 6, 7, 8, 9, 10, 12, 14, 16, 18];

interface FormValuesProp {
  formValues: FormValues;
  setFormValues: React.Dispatch<React.SetStateAction<FormValues>>;
}

//TODO: The fucking prop isn't updating???

interface FormValues {
  CFM: number;
  goalFriction: number;
  variance: number;
  conduitType: string;
  width: number;
  height: number;
  diameter: number;
}

const InputComponent: React.FC<FormValuesProp> = ({
  formValues,
  setFormValues,
}) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
    console.log("test");
    console.log(formValues);
  };
  return (
    <>
      <div className={styles.container}>
        <form className={styles.inputForm}>
          <label>CFM</label>
          <br />
          <input
            type="number"
            defaultValue={CFM_DEFAULT}
            name="CFM"
            onInput={handleChange}
          />
          <br />
          <label>Goal Friction</label>
          <br />
          <input
            type="number"
            defaultValue={FRICTION_DEFAULT}
            name="goalFriction"
            onInput={handleChange}
          />
          <br />
          <label>Variance</label>
          <br />
          <input
            type="number"
            defaultValue="0.02"
            name="variance"
            onInput={handleChange}
          />
          <br />
        </form>
      </div>
      <div>
        {/*
        <form>
          <input
            type="radio"
            value="Pipe"
            name="conduitType"
            onInput={handleChange}
          />
          <label>Pipe</label>
          <br />
          <input
            type="radio"
            value="Tube"
            name="conduitType"
            onInput={handleChange}
          />
          <label>Tube</label>
        </form>
        */}
      </div>
      {/*
      <div>
        {formValues.conduitType === "Pipe" && (
          <form>
            <label>Diameter</label>
            <input type="number" name="diameter" onInput={handleChange} />
          </form>
        )}
        {formValues.conduitType === "Tube" && (
          <form>
            <label>Width</label>
            <br />
            <input type="number" name="width" onInput={handleChange} />
            <br />
            <label>Height</label>
            <br />
            <input type="number" name="height" onInput={handleChange} />
            <br />
          </form>
        )}
      </div>
      */}
    </>
  );
};

function HeaderComponent() {
  return <h1 className={styles.header}>HVAC Calculator</h1>;
}

interface calculatedPipe {
  diameter: number;
  friction: number;
  rank: number;
  color: string;
}

interface calculatedTube {
  height: number;
  width: number;
  friction: number;
  rank: number;
  color: string;
}

function isClose(a: number, b: number, tolerance: number) {
  return Math.abs(a - b) <= tolerance;
}

function calculatePipeFrictions(
  diameters: number[],
  cfm: number,
  goal_friction: number,
) {
  let calculatedPipes: calculatedPipe[] = [];
  for (const diameter of diameters) {
    let w = 0.914775 * diameter;
    let h = 0.914775 * diameter;
    let friction =
      ((12 *
        (0.11 *
          ((12 * 0.0005) / (1.3 * ((w * h) ** 0.625 / (w + h) ** 0.25)) +
            68 /
              (8.56 *
                ((4 * h * h) / (2 * (h + h))) *
                ((144 * cfm) / (h * h)))) **
            0.25 *
          0.85 +
          0.0028) *
        100) /
        ((4 * h * h) / (2 * (w + h)))) *
      (0.075 * ((144 * cfm) / (w * h) / 1097) ** 2);
    friction = Math.round(friction * 100) / 100;
    let rank = Math.abs(goal_friction - friction);
    rank = Math.round(rank * 100) / 100;
    let color: string;
    if (isClose(friction, goal_friction, goal_friction / 2)) {
      color = GREEN;
    } else if (isClose(friction, goal_friction, goal_friction)) {
      color = YELLOW;
    } else {
      color = RED;
    }
    let cP: calculatedPipe = {
      diameter: diameter,
      friction: friction,
      rank: rank,
      color: color,
    };
    calculatedPipes.push(cP);
  }
  calculatedPipes.sort(
    (x: calculatedPipe, y: calculatedPipe) => x.rank - y.rank,
  );
  return calculatedPipes;
}

function calculateTubeFrictions(
  tube_dimensions: number[][],
  cfm: number,
  goal_friction: number,
) {
  let calculatedTubes: calculatedTube[] = [];
  for (const [w, h] of tube_dimensions) {
    let friction =
      ((12 *
        (0.11 *
          ((12 * 0.0005) / (1.3 * ((w * h) ** 0.625 / (w + h) ** 0.25)) +
            68 /
              (8.56 *
                ((4 * w * h) / (2 * (w + h))) *
                ((144 * cfm) / (w * h)))) **
            0.25 *
          0.85 +
          0.0028) *
        100) /
        ((4 * w * h) / (2 * (w + h)))) *
      (0.075 * ((144 * cfm) / (w * h) / 1097) ** 2);
    friction = Math.round(friction * 100) / 100;

    let rank = Math.abs(goal_friction - friction);
    rank = Math.round(rank * 100) / 100;
    let color: string;
    if (isClose(friction, goal_friction, goal_friction / 2)) {
      color = GREEN;
    } else if (isClose(friction, goal_friction, goal_friction)) {
      color = YELLOW;
    } else {
      color = RED;
    }
    let cT: calculatedTube = {
      width: w,
      height: h,
      friction: friction,
      rank: rank,
      color: color,
    };
    calculatedTubes.push(cT);
  }
  calculatedTubes.sort(
    (x: calculatedTube, y: calculatedTube) => x.rank - y.rank,
  );
  return calculatedTubes;
}

export default function Home() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [tableData, setTableData] = useState<
    calculatedTube[] | calculatedPipe[]
  >([]);

  const validateInput = (x: FormValues) => {
    return (
      formValues.CFM > 0 &&
      formValues.goalFriction > 0 &&
      formValues.variance > 0
    );
  };
  const initialValues: FormValues = {
    CFM: CFM_DEFAULT,
    goalFriction: FRICTION_DEFAULT,
    variance: VARIANCE_DEFAULT,
    conduitType: "",
    width: 0,
    height: 0,
    diameter: 0,
  };
  const [formValues, setFormValues] = useState<FormValues>(initialValues);
  return (
    <>
      <body className={styles.bodyStyle}>
        <HeaderComponent />
        <div className={styles.container}>
          <div className={styles.inputContainer}>
            <InputComponent
              formValues={formValues}
              setFormValues={setFormValues}
            />
            {validateInput(formValues) && (
              <div className={styles.container}>
                <button
                  onClick={(e) => {
                    setIsSubmitted(true);
                    formValues.conduitType == "Pipe"
                      ? setTableData(
                          calculatePipeFrictions(
                            PIPE_DIAMETERS,
                            formValues.CFM,
                            formValues.goalFriction,
                          ),
                        )
                      : setTableData(
                          calculateTubeFrictions(
                            TUBE_DIMENSIONS,
                            formValues.CFM,
                            formValues.goalFriction,
                          ),
                        );
                  }}
                >
                  Submit
                </button>
              </div>
            )}
          </div>
          {isSubmitted && (
            <div className={styles.tableDiv}>
              <table id="frictionTable" className={styles.frictionTable}>
                <thead>
                  <tr>
                    {Object.keys(tableData[0])
                      .filter(
                        (column) => column !== "color" && column !== "rank",
                      )
                      .map((column) => (
                        <th key={column}>{column}</th>
                      ))}
                  </tr>
                </thead>
                <tbody className={styles.frictionTable}>
                  {tableData.map((row, rowIndex) => (
                    <tr key={rowIndex} style={{ backgroundColor: row.color }}>
                      {Object.keys(tableData[0])
                        .filter(
                          (column) => column !== "color" && column !== "rank",
                        )
                        .map((column) => (
                          <td key={column}>{row[column]}</td>
                        ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </body>
    </>
  );
}

import {
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { useState } from "react";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { mockData } from "../../mockdata";
import {
  addExercise,
  addExerciseToWorkout,
  updateWorkout,
} from "../../store/actions/selectedWorkout";
import "./EditWorkoutDialog.css";

const EditWorkoutDialog = ({ dialog, handleCloseDialog }) => {
  const [currentSelection, setCurrentSelection] = useState({
    workout: "",
    exercise: "",
  });
  const [selectedExerciseInput, setSelectedExerciseInput] = useState({
    set: "",
    reps: "",
  });

  const handleWorkoutChange = (e) => {
    setCurrentSelection((prev) => ({ ...prev, workout: e.target.value }));
  };

  const handleClose = () => {
    handleCloseDialog();
    setCurrentSelection({
      day: "",
      workout: "",
      exercises: [],
    });
    setSelectedExerciseInput({
      set: "",
      reps: "",
    });
  };

  const handleInputChange = (e) => {
    setSelectedExerciseInput((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const dispatch = useDispatch();

  const result = useSelector((state) => state.workout.workouts);

  // All Logic for adding Workouts
  const handleAddWorkout = () => {
    let checkDayAndWorkout = result?.find(
      (r) => r.day === dialog.day && r.workout === currentSelection.workout
    );
    // console.log(checkDayAndWorkout);

    // First check if workout for same day exists in selectedWorkout State Array
    if (checkDayAndWorkout) {
      // ----if yes -- Then Check if Same Exercise Exist in the Exercises Array
      const checkExercise = checkDayAndWorkout?.exercises?.find(
        (ex) => ex.exerciseId === currentSelection.exercise
      );

      if (checkExercise) {
        // --------If yes -- Then update the Exercise Contents

        dispatch(
          updateWorkout({
            selected: { ...currentSelection, day: dialog.day },
            newInput: selectedExerciseInput,
          })
        );
      } else {
        // --------If No --- Then Add One More Item To exercises Array
        dispatch(
          addExerciseToWorkout({
            selected: { ...currentSelection, day: dialog.day },
            newInput: selectedExerciseInput,
          })
        );
      }
    } else {
      // ----If no -- Add One More Item to selectedWorkoutArray
      dispatch(
        addExercise({
          day: dialog.day,
          workout: currentSelection.workout,
          exercises: [
            {
              ...selectedExerciseInput,
              exerciseId: currentSelection.exercise,
            },
          ],
        })
      );
    }

    handleClose();
  };

  const handleSelectExercise = (ex) => {
    setCurrentSelection((prev) => ({ ...prev, exercise: ex._id }));
  };

  return (
    <Dialog
      sx={{ maxWidth: "500px", width: "100%", margin: "auto" }}
      open={dialog.open}
      onClose={handleClose}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          color: "#000",
          fontWeight: "600",
          backgroundImage: `linear-gradient(208deg, rgba(255, 128, 69, 0.4), rgba(57, 142, 220, 0.4))`,
          backgroundColor: "white",
        }}
      >
        Edit Workout For {dialog?.day}
      </DialogTitle>
      <Divider />
      <DialogContent>
        <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
          <InputLabel id="workout-dropdown">Workouts</InputLabel>
          <Select
            labelId="workout-dropdown-label"
            id="workout-dropdown"
            value={currentSelection.workout}
            onChange={handleWorkoutChange}
            label="Select Workout"
            name="workout"
          >
            {mockData.map((w) => (
              <MenuItem key={w._id} value={w.workoutName}>
                {w.workoutName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {mockData
          .find((e) => e.workoutName === currentSelection.workout)
          ?.exercises?.map((ex) => (
            <div className="list-items" key={ex.name}>
              <button
                type="button"
                style={{
                  background:
                    currentSelection.exercise === ex._id ? "gray" : "",
                }}
                onClick={() => handleSelectExercise(ex)}
                className="items-button"
              >
                {ex.name} &nbsp; <AiOutlinePlusCircle />
              </button>
            </div>
          ))}
        {currentSelection.exercise && (
          <>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label>Sets</label>
              <input
                name="set"
                type="number"
                className="input-field"
                value={selectedExerciseInput.set}
                onChange={handleInputChange}
              />

              <label>Reps</label>
              <input
                name="reps"
                type="number"
                className="input-field"
                value={selectedExerciseInput.reps}
                onChange={handleInputChange}
              />
            </div>
            <button
              className="add-workout-btn"
              type="button"
              onClick={handleAddWorkout}
            >
              Add
            </button>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditWorkoutDialog;

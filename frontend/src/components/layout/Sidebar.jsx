import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <div className="sidebar">
      <h2>SkillGrid</h2>

      <NavLink to="/admin">Dashboard</NavLink>

      <NavLink to="/admin/candidates">Candidates</NavLink>

      <NavLink to="/admin/assessments">Assessments</NavLink>

      <NavLink to="/admin/assignments">Assignments</NavLink>

      <NavLink to="/admin/results">Results</NavLink>
    </div>
  );
}

export default Sidebar;

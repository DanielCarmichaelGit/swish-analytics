import styles from "../css/Components/DefaultCharts.module.css";
import TopWinningPlayers from "./TopWinningPlayers";

export default function DefaultCharts() {
    return (
        <div className={styles.DefaultCharts}>
            <div className={styles.Chart}></div>
            <div className={styles.Chart}></div>
            <div className={styles.HighRollers}>
            </div>
        </div>
    )
}
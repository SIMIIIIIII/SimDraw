import './Timer.css'

interface ITimerProps {
    timerActive : boolean,
    timeRemaining : number
}

const Timer = ({
    timerActive,
    timeRemaining
} : ITimerProps) => {
    if (timerActive) return (
        <label className="timer">
            Reste: {timeRemaining} sec
        </label>
    )
}

export default Timer
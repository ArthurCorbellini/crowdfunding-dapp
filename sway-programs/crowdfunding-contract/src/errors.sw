library;

pub enum ValidationError {
    DeadlineMustBeAfterToday: (),
    GoalMustBeBiggerThanZero: (),
}

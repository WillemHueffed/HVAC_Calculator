import math

CFM = 800
GOAL_FRICTION = 0.08
VARIANCE = 0.02


class HVACPipingCalculator:
    def __init__(self, cfm, goal_friction, friction_variance):
        self.GREEN = "\033[92m"
        self.YELLOW = "\033[93m"
        self.RED = "\033[91m"
        self.ITALIC = "\033[3m"
        self.TEXT_RESET = "\033[0m"

        self.cfm = cfm
        self.goal_friction = goal_friction
        self.friction_variance = friction_variance

        # Pipe
        self.diameters = [5, 6, 7, 8, 9, 10, 12, 14, 16, 18]
        # Get pipe's D H and W
        self.pipe_data = [
            (dia, 0.914775 * dia, 0.914775 * dia) for dia in self.diameters
        ]
        self.pipe_frictions = []

        # Tube
        self.tube_wh = [
            (16, 3),
            (14, 3),
            (12, 3),
            (10, 3),
            (8, 3),
            (18, 4),
            (16, 4),
            (14, 4),
            (12, 4),
            (10, 4),
            (8, 4),
            (18, 5),
            (16, 5),
            (14, 5),
            (12, 5),
            (10, 5),
            (8, 5),
            (36, 6),
            (34, 6),
            (42, 6),
            (40, 6),
            (38, 6),
            (32, 6),
            (60, 6),
            (58, 6),
            (56, 6),
            (54, 6),
            (52, 6),
            (50, 6),
            (48, 6),
            (46, 6),
            (44, 6),
            (30, 6),
            (28, 6),
            (26, 6),
            (24, 6),
            (22, 6),
            (20, 6),
            (18, 6),
            (16, 6),
            (14, 6),
            (12, 6),
            (10, 6),
            (8, 6),
            (24, 8),
            (22, 8),
            (28, 8),
            (26, 8),
            (50, 8),
            (48, 8),
            (46, 8),
            (44, 8),
            (42, 8),
            (40, 8),
            (38, 8),
            (36, 8),
            (34, 8),
            (32, 8),
            (30, 8),
            (20, 8),
            (18, 8),
            (16, 8),
            (14, 8),
            (12, 8),
            (10, 8),
            (8, 8),
            (18, 10),
            (20, 10),
            (16, 10),
            (36, 10),
            (34, 10),
            (32, 10),
            (30, 10),
            (28, 10),
            (26, 10),
            (24, 10),
            (22, 10),
            (14, 10),
            (12, 10),
            (10, 10),
            (14, 12),
            (16, 12),
            (30, 12),
            (28, 12),
            (26, 12),
            (24, 12),
            (22, 12),
            (20, 12),
            (18, 12),
            (12, 12),
            (14, 14),
            (24, 14),
            (22, 14),
            (20, 14),
            (18, 14),
            (16, 14),
            (22, 16),
            (20, 16),
            (18, 16),
            (16, 16),
            (20, 18),
            (18, 18),
            (20, 20),
        ]
        self.tube_frictions = []

        self.calc_pipe_friction()
        self.print_sorted_pipe_frictions()
        print()
        self.calc_tube_friction()
        self.print_sorted_tube_frictions()

    def calc_pipe_friction(self):
        for index, (d, w, h) in enumerate(self.pipe_data):
            friction = (
                (
                    12
                    * (
                        (
                            0.11
                            * (
                                (
                                    (
                                        (12 * 0.0005)
                                        / (
                                            1.3
                                            * (((w * h) ** 0.625) / ((w + h) ** 0.25))
                                        )
                                    )
                                    + (
                                        68
                                        / (
                                            8.56
                                            * ((4 * h * h) / (2 * (h + h)))
                                            * ((144 * self.cfm) / (h * h))
                                        )
                                    )
                                )
                                ** 0.25
                            )
                        )
                        * 0.85
                        + 0.0028
                    )
                    * 100
                )
                / ((4 * h * h) / (2 * (w + h)))
            ) * (0.075 * ((((144 * self.cfm) / (w * h)) / 1097) ** 2))

            rank = abs(self.goal_friction - friction)
            color = None
            if math.isclose(
                friction, self.goal_friction, abs_tol=self.goal_friction / 2
            ):
                color = self.GREEN
            elif math.isclose(friction, self.goal_friction, abs_tol=self.goal_friction):
                color = self.YELLOW
            else:
                color = self.RED
            self.pipe_frictions.append((d, friction, rank, color))

    def print_sorted_pipe_frictions(self):
        print(self.ITALIC + "Pipe Values:" + self.TEXT_RESET)
        sorted_pipe_data = sorted(self.pipe_frictions, key=lambda x: x[2])
        for x in sorted_pipe_data:
            print(
                x[3]
                + "Dia: {:<5} | Friction: {:<5}".format(x[0], round(x[1], 2))
                + self.TEXT_RESET
            )

    def calc_tube_friction(self):
        for index, (w, h) in enumerate(self.tube_wh):
            friction = (
                (
                    12
                    * (
                        (
                            0.11
                            * (
                                (
                                    (
                                        (12 * (0.0005))
                                        / (
                                            1.3
                                            * (((w * h) ** 0.625) / ((w + h) ** 0.25))
                                        )
                                    )
                                    + (
                                        68
                                        / (
                                            8.56
                                            * ((4 * w * h) / (2 * (w + h)))
                                            * ((144 * self.cfm) / (w * h))
                                        )
                                    )
                                )
                                ** 0.25
                            )
                        )
                        * 0.85
                        + 0.0028
                    )
                    * 100
                )
                / ((4 * w * h) / (2 * (w + h)))
            ) * (0.075 * ((((144 * self.cfm) / (w * h)) / 1097) ** 2))
            rank = abs(self.goal_friction - friction)
            color = None
            if math.isclose(
                friction, self.goal_friction, abs_tol=self.goal_friction / 2
            ):
                color = self.GREEN
            elif math.isclose(friction, self.goal_friction, abs_tol=self.goal_friction):
                color = self.YELLOW
            else:
                color = self.RED
            self.tube_frictions.append((w, h, friction, rank, color))

    def print_sorted_tube_frictions(self):
        print(self.ITALIC + "Tube Values:" + self.TEXT_RESET)
        sorted_tube_friction_data = sorted(self.tube_frictions, key=lambda x: x[3])
        for x in sorted_tube_friction_data:
            print(
                x[4]
                + "width: {:<5} | height: {:<5} | Friction: {:<5}".format(
                    x[0], x[1], round(x[2], 2)
                )
                + self.TEXT_RESET
            )

    def calculate_pipe_size(self, flow_rate, velocity):
        # Calculate pipe diameter using flow rate and velocity
        diameter = (4 * flow_rate) / (math.pi * velocity)
        return diameter

    def calculate_velocity(self, flow_rate, diameter):
        # Calculate fluid velocity using flow rate and pipe diameter
        velocity = flow_rate / (math.pi * (diameter / 2) ** 2)
        return velocity

    def calculate_pressure_drop(self, flow_rate, diameter, length, viscosity):
        # Calculate pressure drop using flow rate, pipe diameter, length, and fluid viscosity
        pressure_drop = (128 * viscosity * length * flow_rate**2) / (
            math.pi**4 * diameter**5
        )
        return pressure_drop


if __name__ == "__main__":
    calculator = HVACPipingCalculator(CFM, GOAL_FRICTION, VARIANCE)

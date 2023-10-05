---
title: "The Money Machine: An autonomous robot"
date: 2022-12-15
categories: ["projects"]
draft: true
---

# Overview
This was my final project for ECE118 - Intro to Mechatronics at UCSC, completed in collaboration with [Matt Kaltman](https://www.linkedin.com/in/matthew-kaltman-41a46824b/) and [Neili Hu](https://www.linkedin.com/in/neili-hu-996002231/).

![The Money Machine in all its glory.](./robot.png)

My team and I created an autonomous robot called the Money Machine capable of firing a ping-pong ball at a target marked by a beacon emitting a 2kHz infrared signal. Each successful shot into the target could earn one, three, or five points depending on where the shot was made from, with the different point zones within the arena delineated by wires carrying an oscillating current. There would be an obstacle placed in a random position within the arena and the robot was allowed to carry a maximum of three ping-pong balls at a time with reloads only permitted in a designated zone at the far left of the arena. Lastly, we had two minutes to score ten points.

Due to the two-minute time constraint, our approach was to rely on rapid-fire long-range shots. Our robot navigated toward one of the 5-point zones, fired the balls, and then turned around to find the reload zone - rinse and repeat.

{{< video src="robot_buckets" height="600" caption="The robot in action." >}}

![Top-down diagram of the arena.](./arena-diagram.png)

## A summary of our robot
- Event-driven architecture in C running on chipKIT Uno32
- Analog filter to detect the 2kHz beacon
- 2 track wire detectors for localization
- 5 infrared sensors, 2 bump sensors for obstacle avoidance
- 2 wheels + 2 DC motors
- Flywheel-style ping-pong ball launcher made from PVC pipe, DC motor, and a solenoid
- Beam break sensor to detect reload completion
- LED light strips for swag

# Electrical
### Track wire detector
The track wire used to delineate the different point zones carries a current oscillating at 24-26 kHz. This generates an oscillating magnetic field around the wire. If you put a coil of wire in this field with the right orientation, the coil will experience an oscillating EMF at the same frequency, which can be detected as a voltage.

![Track wire detector block diagram.](./sch_track-block.png)

We use a solenoid to detect the track wire and pass its output through a high-pass filter to isolate the signal. The output of this goes to an ADC pin. Getting closer to the track wire results in a higher ADC reading.

### Infrared sensors
We added five infrared distance sensors mounted on the front and sides of our robot to help with obstacle avoidance. To conserve power, all IR sensors are hooked up to a TIP122 transistor that acts as a power switch so the sensors can be deactivated when the robot isn't actively navigating.

![Schematic for IR sensors.](./sch_ir.png)

### Bump sensors
As shown in the video above, the IR sensors work quite well for detecting walls. They unfortunately don't work for detecting the obstacle on the field because the obstacle is made of black foam that absorbs the infrared light. To get around that, we also included two bump sensors made with microswitches on the front right and front left of the robot.

### Beacon detector
The beacon detector is the most important sensor on the robot because it locates the target. The detector consists of a phototransistor to receive the 2kHz IR signal emitted by the beacon and an analog filter to isolate the signal.

To get a usable signal out of the phototransistor, we needed a few gain stages to amplify the phototransistor's output. The amplified output is then sent to a 4th order Chebyshev bandpass made of two cascaded lowpass and highpass filters. Then to convert this to a clean digital signal suitable for the Uno32, we added a peak detector and a comparator. I tried to add a hysteresis to the comparator to get a cleaner output signal but I couldn't get it working, so I just debounced the signal in software later on.

The end result was a pretty good detector that could pick up a signal 15 feet away! The minimum requirement was 8 feet (the length of the arena).

![Beacon detector block diagram.](./sch_beacon-detector-block.png)

![Beacon detector schematic.](./sch_beacon.png)

![Beacon detector perfboard. Pretty happy with how neat it turned out.](./beacon_perf.jpg)

### Reload sensor
Once in the reload zone, we needed a way to detect when the robot was fully loaded with all 3 ping-pong balls. One option would have been to simply set a short timer, but we wanted to be more efficient because of the time constraint. We placed a beam break made from 2 IR sensors at the height of the 3rd ball and if it stayed tripped for 0.5 seconds, it detected a full reload.

{{< video src="reload" height="600" caption="Prototype of our reload sensor with LED showing the sensor state." >}}

# Software
We were required to use an event-driven framework provided by the course staff to implement the software.

#### What the framework does for me
Prety much all the boilerplate stuff for any event-driven architecture.
- Creation, manipulation, and monitoring of event queues
- Regular execution of event-checking (polling) routines to detect non-interrupt generated events
- Execution of service functions to process events

#### What I did
- Define events and write event checking functions
- Write service functions to respond appropriately to events
- State machine implementation and overall system design
- Determine what hardware to use, source the parts, and write drivers for everything

## Drivers and event checkers 
Writing drivers and event checkers for the various components on the bot wasn't too hard. The bulk of the work was in state machine design and implementation.

### Motor control
We used an H-bridge and PWM signals for this. I wrote a tiny library so it would be easy to control the motors from elsewhere within the code.

### Flywheel launcher
To launch the ball, we first ramped up the flywheel motor and then use a small solenoid to push a ball into the motor once it got up to speed. We connected the solenoid to a TIP122 transistor and just used a digital output pin on the Uno apply voltage across the body of the transistor to activate and deactivate the solenoid.

### Track wire
We read the output of the two track wire sensors with an ADC. Through testing we were able to determine the minimum and maximum ADC readings for when the track wire was detected or not.

### Beacon detector
As mentioned earlier, the beacon detector circuit outputs a digital signal, but it's an insanely bouncy digital signal that I had to fix in software. When the beacon is first detected, it posts an event to the main state machine and starts a 200ms timer. Every rising edge of the beacon signal thereafter resets the 200ms timer. If the timer expires, we know the beacon is no longer detected, and another event is sent to the main state machine.

## Hierarchical state machine overview
{{< mermaid >}}
stateDiagram
    direction LR
    [*] --> Navigate
    Navigate --> Shoot
    Shoot --> Return
    Return --> Reload
    Reload --> Navigate

    state Navigate {
      [*] --> Orient
      Orient --> ArcForwards
    }
    
    state Shoot {
      [*] --> FindBeacon
      FindBeacon --> FindBeaconEdge1
      FindBeaconEdge1 --> FindBeaconEdge2
      FindBeaconEdge2 --> Center
      Center --> Ramp
      Ramp --> Dispense
      Dispense --> Ramp
    }

    state Return {
      [*] --> TurnAround
      TurnAround --> DriveForwards
    }
{{< /mermaid >}}

#### Navigate
Responsible for navigating to the 5-point zone. During `Orient` the robot slowly turns until the beacon is found, then it arcs forwards trying to find the 5-point zone. It moves to the `Shoot` state on the rising edge of the track wire sensor signal.

#### Shoot
This state is responsible for aiming and launching the ping-pong balls. The reasoning behind having multiple aiming substates is below.

![Why multiple FindBeacon states are needed.](./findbeacon.png)

To center the robot, we use a free-running timer to determine the time it takes for the robot to turn from the first edge to the second edge. Then we turn in the opposite direction and set a timer for half of that time.

#### Return
This state tries to bring the robot back to the reload zone by turning around and driving forwards, avoiding obstacles along the way. We start reloading the robot once it's made its way into the reload zone.

#### Reload
In this state, the robot waits for the reload sensor to stay tripped for a certain amount of time, signifying that it's fully loaded.

## Obstacle avoidance during navigation
### IR sensors

{{< video src="autonav" height="600" caption="Basic obstacle avoidance using just IR sensors." >}}

### Bump sensors

{{< video src="robot_obstacle" height="600" caption="Robot in action with a better look at the bump sensors." muted="true" >}}

# Other stuff
In addition to being the software lead, I also maintained documentation for the team to help keep us organized, on track, and aware of each others' progress.

![Documentation website.](./documentation.png)

# Retrospective
Since it was an open-ended project, we had a lot of ideas for how to accomplish the task. It took a very long time for us to settle on a final design, leaving little time to actually implement it. I wasted a week fighting with ultrasonic sensors only to scrap them because their readings were so unreliable.

On the electrical and mechanical side of things, I wish we had gotten a higher current H-bridge to reduce the time needed to ramp up the flywheel motor. That's my biggest regret. We also should've spent more time designing a shield for the beacon detector to improve the robot's aim.

# Conclusion
We ended up placing third in the class competition behind one student team and one team comprised of course alumni who were given a day to build their bot. Not too bad!

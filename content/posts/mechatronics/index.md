---
title: "The Money Machine: An autonomous robot"
image: robot.png
date: 2022-12-15
categories: ["projects"]
---

## Overview
This was my final project for ECE118 - Intro to Mechatronics at UCSC.

### Team members
- Me: Software lead
- [Matt Kaltman](https://www.linkedin.com/in/matthew-kaltman-41a46824b/): Electrical lead
- [Neili Hu](https://www.linkedin.com/in/neili-hu-996002231/): Mechanical lead

My team and I created an autonomous robot called the Money Machine capable of firing a ping-pong ball at a target marked by a beacon emitting a 2kHz infrared signal. Each successful shot into the target could earn one, three, or five points depending on where the shot was made from, with the different point zones within the arena delineated by wires carrying an oscillating current. There would be an obstacle placed in a random position within the arena and the robot was allowed to carry a maximum of three ping-pong balls at a time with reloads only permitted in a designated zone at the far left of the arena. Lastly, we had two minutes to score ten points.

{{< figure height=400 src="./_img_robot.png" caption="The Money Machine in all its glory. (Please ignore the lack of cable management.)" >}}

Due to the two-minute time constraint, our approach was to rely on rapid-fire long-range shots. Our robot navigated toward one of the 5-point zones, fired the balls, and then turned around to find the reload zone - rinse and repeat.

{{< video src="_vid_robot_buckets" height="500" caption="The robot in action." >}}

{{< figure height=400 src="./_diagram_arena.png" caption="Top-down view of the arena, which you can also see in the video above." >}}

### A summary of our robot
- Event-driven architecture in C running on chipKIT Uno32
- 4th order Chebyshev bandpass filter to detect the 2kHz beacon
- 2 track wire detectors for localization
- 5 infrared sensors, 2 bump sensors for obstacle avoidance
- 2 wheels + 2 DC motors
- Flywheel-style ping-pong ball launcher made from PVC pipe, DC motor, and a solenoid
- Beam break sensor to detect reload completion
- LED light strips for swag

## Electrical
### Track wire detector
The track wire used to delineate the different zones carries a current oscillating at 24-26 kHz. This generates an oscillating magnetic field around the wire. If you put a coil of wire in this field with the right orientation, the coil will experience an oscillating EMF at the same frequency, which can be detected as a voltage.

{{< figure src="./_sch_track-block.png" caption="Track wire detector block diagram." >}}

We use a solenoid to detect the track wire and pass its output through a high-pass filter to isolate the signal. The output of this goes to an ADC pin. Getting closer to the track wire results in a higher ADC reading.

### Infrared sensors
We added five infrared distance sensors mounted on the front and sides of our robot to help with obstacle avoidance. To conserve power, all IR sensors are hooked up to a TIP122 transistor that acts as a power switch so the sensors can be deactivated when the robot isn't actively navigating.

{{< figure src="./_sch_ir.png" caption="Schematic for IR sensors." >}}

### Bump sensors
As shown in the video above, the IR sensors work quite well for detecting walls; however, they don't work for detecting the obstacle on the field because the obstacle is made of black foam that absorbs the infrared light. To get around that, we also included two bump sensors made with microswitches on the front right and front left of the robot.

### Beacon detector
The beacon detector is the most important sensor on the robot because it locates the target. The detector consists of a phototransistor to receive the 2kHz IR signal emitted by the beacon and an analog filter to isolate the signal.

To get a usable signal out of the phototransistor, we needed a few gain stages to amplify the phototransistor's output. The amplified output is then sent to a 4th order Chebyshev bandpass made of a cascaded lowpass and highpass filters. Then to convert this to a clean digital signal suitable for the Uno32, we added a peak detector and a comparator. I tried to add a hysteresis to the comparator to get a cleaner output signal but I couldn't get it working, so I just debounced the signal in software later on.

The end result was a pretty good detector that could pick up a signal 15 feet away! The minimum requirement was 8 feet (the length of the arena).

{{< figure src="./_diagram_beacon.png" caption="Beacon detector block diagram." >}}

{{< figure src="./_sch_beacon.png" caption="Beacon detector schematic." >}}

{{< figure width=400 src="./_img_beacon-perf.jpg" caption="Beacon detector perfboard." >}}

### Reload sensor
Once in the reload zone, we needed a way to detect when the robot was fully loaded with all 3 ping-pong balls. One option would have been to simply set a short timer and trust that we reloaded it within that time, but we wanted to be as efficient as possible. We placed a beam break made from 2 IR sensors at the height of the 3rd ball and if it stayed tripped for 0.5 seconds, it indicated a full reload.

{{< video src="_vid_reload" height=400 caption="Prototype of our reload sensor with LED showing the sensor state." >}}

## Software
We were required to use an event-driven framework provided by the course staff to implement the software.

### What the framework does for me
Pretty much all the boilerplate stuff for any event-driven architecture.
- Creation, manipulation, and monitoring of event queues
- Regular execution of event-checking (polling) routines to detect non-interrupt generated events
- Execution of service functions to process events

### What I did
- Overall system design and state machine implementation
- Define events and write event checking functions
- Write service functions to respond appropriately to events
- Determine what hardware to use, source the parts, and write drivers for everything

### Drivers and event checkers 
Writing drivers and event checkers for the various components on the bot wasn't too hard. The bulk of the work was in state machine design and implementation.

### Motor control
We used an H-bridge and PWM signals for this (higher duty cycle == higher voltage applied to motor == higher RPM). I wrote a tiny library so it would be easy to control the motors from elsewhere within the code.

### Flywheel launcher
To launch the ball, we first ramped up the flywheel motor and then use a small 12V solenoid to push a ball into the motor once it got up to speed. Since the max output voltage of the Uno32 was only 3.3V, we connected the solenoid to a TIP122 transistor and used an output pin on the Uno apply voltage across the body of the transistor to activate and deactivate the higher voltage solenoid.

### Track wire
We read the output of the two track wire sensors with an ADC. Through testing we were able to determine the minimum and maximum ADC readings for when the track wire was detected or not.

### Beacon detector
As mentioned earlier, the beacon detector circuit outputs a digital signal, but it's an insanely bouncy digital signal because I couldn't get the hysteresis circuit right for whatever reason. I had to fix in software. When the beacon is first detected, it posts an event to the main state machine and starts a 200ms timer. Every rising edge of the beacon signal thereafter resets the 200ms timer. If the timer expires, we know the beacon is no longer detected.

### Hierarchical state machine overview

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
This is responsible for navigating to the 5-point zone. During `Orient` the robot slowly turns until the beacon is found, then it arcs forwards trying to find the 5-point zone. It moves to the `Shoot` state on the rising edge of the track wire sensor signal.

#### Shoot
This state is responsible for aiming and launching the ping-pong balls. The reasoning behind having multiple aiming substates is below.

{{< figure height=400 src="./_img_findbeacon-justification.png" caption="Why multiple FindBeacon states are needed." >}}

To center the robot, we use a free-running timer to determine the time it takes for the robot to turn from the first edge to the second edge. Then we turn in the opposite direction for half of that time to center it.

Once the robot is centered on the target, we can finally shoot the ball. As seen in previous videos, we wait for a DC motor with an attached flywheel to spin fast enough to launch a ball 6-7ft away into the target basket, then use a solenoid to push a ping pong ball into the flywheel. With our navigation algorithm the robot always ended up roughly the same distance away from the target, so the launch distance was fixed.

We control the motor speed by sending a PWM signal to an H-bridge (higher duty cycle == higher RPM) and we determined the correct duty cycle through iterative testing. We put the robot on the arena, changed the duty cycle variable, recompiled, and re-flashed the MCU a bunch of times, and then I got really irritated with it taking 8 years to flash each time so I wrote a test program to control the motor speed from the command line. We found the right speed a few minutes later.

#### Return
The rules of the assignment say that we can only reload the robot when it gets into a designated, track wire-lined reload zone, and this state tries to get there. We could've detected a return to the reload zone using our track wire sensors (almost all the other teams did), but those sensors were difficult to use for the following reasons:

1. The sensor needs to be angled perpendicular to the track wire in order to detect it.
2. The sensors can be quite noisy.
3. Track wire outlines the entire 1-point and 5-point zones as well as the reload zone, so a tripped sensor doesn't necessarily mean you're in the reload zone.

{{< figure height=400 src="./_diagram_trackwire-location.png" caption="Arena diagram with trackwire outlined in green." >}}

We opted for a much simpler method: have our little robot turn around and wander forwards until it found its way back.

It sounds dumb but it actually worked really well because our algorithm to navigate to the shooting position was good enough to ensure that our robot always ended up within the area shown below. Then when it turns around and wanders, the reload zone is literally the only place to go. Once it got there we would start reloading, tripping the beam-break sensor and causing it to transition to the next state.

{{< figure height=400 src="./_diagram_retreload-location.png" caption="The robot is always somewhere within the red box when first trying to return to the reload zone." >}}

#### Reload
Here the robot waits for the reload sensor positioned at the height of the 3rd ping pong ball to stay tripped for a half a second, indicating that it's fully loaded.

### Obstacle avoidance during navigation
#### IR sensors
By default, our robot drives straight. There are 5 IR sensors mounted on the front and sides of our robot and if a sensor trips during driving, the angle is adjusted to avoid a collision. Each sensor has a different angle adjustment.

{{< figure height=300 src="./_diagram_ir-sensor-locations.png" caption="Locations of IR sensors on the robot and each sensor's corresponding angle adjustment." >}}

The front center sensor can adjust the angle either to the right or to the left.

```
if front center sensor is tripped:
    if any of the left sensors are tripped:
        angle adjust = +45°
    else if any of the right sensors are tripped:
        angle adjust = -45°
    else:
        angle adjust = -45°
```

{{< video src="_vid_autonav" height="500" caption="Basic obstacle avoidance using just IR sensor angle adustments." >}}

In other words:

```
if (GoingToCrash) {
  Dont();
}
```

#### Bump sensors
If either of the bump sensors are triggered, the robot reverses, turns away from the bump, and resumes operation.

{{< video src="_vid_robot_obstacle" height="500" caption="Robot in action with a better look at the bump sensors." muted="true" >}}

## Other stuff
In addition to being the software lead, I also maintained documentation for the team in the form of a website containing notes and plans to help keep us organized, on track, and aware of each others' progress.

## Retrospective
Since it was an open-ended project, we had a lot of ideas for how to accomplish the task. It took a very long time for us to settle on a final design, leaving little time to actually implement it. I wasted a week fighting with ultrasonic sensors only to scrap them because their readings were so unreliable.

On the electrical and mechanical side of things, my biggest regret is not getting a higher current H-bridge to reduce the time needed to ramp up the flywheel motor. With our puny and university-provided default 2A H-bridge, it took a solid 3-4 seconds to ramp up for the initial shot and then another 1-2 seconds in between shots after that. There was another team that used a 50A H-bridge that absolutely RIPPED and had the motor ready to launch instantly.

We also should've spent more time designing a shield for the beacon detector to improve the robot's aim.

## Conclusion
We ended up placing third in the class competition behind one team and another team comprised of students who were course alumni and given a day to build their bot. Not too bad!


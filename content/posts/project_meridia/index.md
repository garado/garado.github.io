---
title: "A NEW HAND TOUCHES THE BEACON."
date: 2023-09-22
categories: ["projects"]
draft: true
---

*"Listen. Hear me and obey. A foul darkness has seeped into my temple. A darkness that you will destroy."*

For this small project I built Meridia's Beacon, a quest item from Skyrim. When the Beacon is picked up in the game, Meridia, who evidently has trouble using her inside voice, rather loudly announces a new quest to you. I 3D printed the Beacon, embedded some magnets into it, and set up an ESP32, a reed switch, and a speaker to play Meridia's iconic quote when the Beacon is picked up.

{{< video src="game" caption="Meridia's Beacon in-game. (Courtesy of jaxx attax on Youtube.)" >}}

## Development
To detect when the beacon is picked up, I initially made a beam break using two IR sensors that I had lying around. I didn't like how bulky the sensors were, so I ordered a reed switch and embedded two magnets in the 3D printed beacon, which worked beautifully. I used an [online tool](https://bitluni.net/wp-content/uploads/2018/01/Audio2Header.html) to convert the audio WAV file to a C header with a buffer containing the voltages for the audio, and once pickup is detected, the DAC starts playback. I configured it for continuous output by DMA.

After all the prototyping was done, I soldered everything together on a spare perfboard I had lying around and crammed it in a tiny treasure chest that I printed.

## Pitfalls
The coding part of this project took about an hour, which was mostly spent stumbling around the ESP32 docs figuring out how to configure the DAC. The electrical part took a bit longer because I had to figure out why nothing worked when I put it on the perfboard. (Nothing ever seems to work when I first put it on a perfboard. 😐) I had placed the reed switch directly above the speaker, but I didn't realize the speaker had a magnet in it and was always triggering the switch. I moved the switch to the other side and the problem was solved.

Another issue I faced was the audio conversion tool that I used generated a signed array in the range (-127,127) but the ESP32 DAC requires a range (0,255). When I played the audio with the signed voltages, the quality was horrible because the DAC just clipped the negative array elements. Once I realized this, I used a little Regex magic to convert all 180,000ish array elements to the proper range.

{{<audio src="2023/project_meridia/audio-before-negative-fix.mp3" caption="Audio before fixing the array. Headphone users beware.">}}

Lastly, I initially had the audio playback triggered on a posedge interrupt, which worked fine on the breadboard. On the perfboard, the signal was a lot noisier for whatever reason, so the ISR would go off multiple times per pickup and it would in turn play the audio multiple times. I usually prefer to debounce with hardware but given that everything was already soldered together, I did it in software by only polling for changes in state every 100ms or so.

## Resources and links
- [Treasure chest stl](https://www.thingiverse.com/thing:4634679)
- [Meridia's Beacon stl](https://www.thingiverse.com/thing:3239363)
- [Code](https://github.com/garado/tinyprojects/tree/main/meridia)

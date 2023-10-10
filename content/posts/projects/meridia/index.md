---
title: "A NEW HAND TOUCHES THE BEACON."
date: 2023-09-22
categories: ["projects"]
---

> LISTEN. Hear me and obey. A foul darkness has seeped into my temple. A darkness that you will destroy.

For this small project I built a quest item from Skyrim called Meridia's Beacon. When the beacon is picked up in the game, Meridia, who evidently has trouble using her inside voice, rather loudly announces a new quest to you. I 3D printed a small treasure chest and the beacon, and when you pick up the beacon, a speaker hidden inside the chest plays Meridia's iconic quote.

{{< video src="meridia"  height=600 >}}

{{< video src="game" caption="Meridia's Beacon in-game. (Courtesy of jaxx attax on Youtube.)" >}}

## Development
To detect pick up, I initially made a beam break using two IR sensors that I had lying around. I didn't like how bulky the sensors were, so I ordered a reed switch and embedded two magnets in the 3D printed beacon, which worked beautifully. I used an [online tool](https://bitluni.net/wp-content/uploads/2018/01/Audio2Header.html) to convert the audio WAV file to a C header with a buffer containing the voltages for the audio (this was before I knew about `xxd`), and once pickup is detected, the DAC starts playback.

After all the prototyping was done, I soldered everything together on a spare perfboard I had lying around and crammed it in a tiny treasure chest that I printed and painted.

The coding part of this project took about an hour, which was mostly spent stumbling around the ESP32 docs figuring out how to configure the DAC. The electrical part took a bit longer because I had to figure out why nothing worked when I put it on the perfboard. (Nothing ever seems to work when I first put it on a perfboard. 😐) I had placed the reed switch directly above the speaker when I shoved everything into the chest, but I didn't realize the speaker had a magnet in it and was always triggering the switch. I moved the switch to the other side and the problem was solved.

Another issue I faced was the audio conversion tool that I used generated an 8-bit signed array, but the ESP32 DAC required it to be unsigned. When I played the audio with the signed voltages, the quality was horrible because the DAC just clipped the elements with negative values. A little Regex magic converted all 180,000ish array elements to the proper range. It would have been funnier if I kept it that way though, I think. It fits Meridia more.

{{<audio src="/posts/projects/meridia/audio-before-negative-fix.mp3" caption="Audio before fixing the array. Headphone users beware.">}}

## Resources and links
- [Treasure chest stl](https://www.thingiverse.com/thing:4634679)
- [Meridia's Beacon stl](https://www.thingiverse.com/thing:3239363)
- [Code](https://github.com/garado/tinyprojects/tree/main/meridia)

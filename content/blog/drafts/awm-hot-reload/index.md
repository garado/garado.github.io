---
title: "Hot reloading in AwesomeWM"
date: 2023-09-07T12:04:16-05:00
series: ["cozy", "awm"]
draft: true
---

I am not the first person to implement a theme switcher in Awesome and I won't be the last. I'm sure I'm also not the first person to think that Awesome looks *ugly* when it restarts.

This is the same method that [Kasper24](https://github.com/Kasper24/KwesomeDE) uses. This tutorial assumes some working knowledge of AwesomeWM and Lua.

### 1. Generate lookup table
First we need to generate a lookup table that maps old colors to new colors. It's important that every old color maps to exactly *one* new color or else it won't change the colors correctly.

It's helpful to use color variables instead of hardcoding the hex colors and also to have a strictly defined color palette. [My config](https://github.com/garado/cozy) implements something very similar to the [Material Design](https://m2.material.io/design/color/the-color-system.html#color-usage-and-palettes) palette guidelines.

```lua
local lut = {
  ["#eceff4"] = "#eceff4"
}

awesome.emit_signal("theme::reload", lut)
```

### 2. Connect every relevant wibox to a reload signal
Now we need a way to communicate with widgets and tell them when to reload. We can copy and paste the relevant code for any themable widget directly from the AWM library and add the connection within their constructors. When requiring a file, AwesomeWM searches your config files before the default installed libraries, so by copying the wibox files to your config dir, you can override the defaults.

`ls ~/.config/awesome/` would then look like this.

```
+-- rc.lua
\-- wibox
    +-- container
    │   +-- background.lua
    │   \-- margin.lua
    \-- widget
        +-- imagebox.lua
        +-- progressbar.lua
        \-- slider.lua
```

Below is an example of what the background widget file would look like. The other ones would look similar - just edit their relevant properties.

**Note:** As far as I know, the background widget doesn't store its bg or fg colors as strings. Instead of storing them, it immediately converts it to a fancy Cairo color thing (I think - I don't know much about AWM under the hood). As a workaround, I modified the `set_fg` and `set_bg` methods to store the strings in `fg_hex` and `bg_hex`, respectively.

```lua
-- Copied and pasted wibox.container.background constructor.
local function new(widget, bg, shape)
  local ret = base.make_widget(nil, nil, {
    enable_properties = true,
  })

  gtable.crush(ret, background, true)

  ret._private.shape = shape

  ret:set_widget(widget)
  ret:set_bg(bg)

  -- Add something like this!
  awesome.connect_signal("theme::reload", function(lut)
    ret:set_bg(lut[ret._private.bg_hex])
    ret:set_fg(lut[ret._private.fg_hex])
    ret._private.shape_border_color = lut[ret._private.shape_border_color)
  end)

  return ret
end
```
<br>

#### Alternatives
Another way to do this is to create a wrapper for `wibox.container.background`, but that means you have to actually write the wrapper and then go around your code replacing every instance of `wibox.container.background` with it. I was looking for a method that required the least amount of refactoring possible and I think this is it. Unless you implement more complicated custom widgets, this method requires little to no refactoring. (I of course have nothing but complicated custom widgets, so it took a little longer.)

### 3. Test and connect everything left behind
Some other things that aren't parts of the built-in widgets like client borders will need to be manually connected to the `theme::reload` signal. Keep restarting your config and patch things up as you go. The whole conversion process took me about an hour and a half, and most of that was custom widgets.

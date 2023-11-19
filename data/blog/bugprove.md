---
title: 'A Closer Look At BugProve'
date: '2023-11-19T00:00:00.000Z'
author: 'Matthias Endler'
---

![BugProve logo](/assets/images/blog/bugprove/bugprove.jpg)

I have never been a huge fan of IoT devices.
Granted, they make our life easier, but they also open the door to a lot of security issues.
Most IoT devices are black boxes. I don't know what's inside and I don't know what they connect to.

Nonetheless, the number of IoT devices in our home is growing.
Just looking at the devices I purchased within the last 2 years, I can count six IoT devices:

- An automatic door lock
- A new robot vacuum cleaner
- Heating control
- A smart cat litter box
- A smart cat water fountain
- A cat feeder

You probably guessed it: we recently got a new family member - our lovely cat,
Oskar.

![Oskar](/assets/images/blog/bugprove/oskar.jpg)

The irony that I co-maintain a website about static code analysis
and security tools, but I have no idea what's inside the firmware of the devices
that I use every day is not lost on me.

## Enter BugProve

Recently, a company called BugProve reached out and started
[sponsoring](https://github.com/sponsors/analysis-tools-dev) our website. As
with every sponsor, we check their offering and introduce it to our readers in
form of a blog post. So I sat down and tried out their service. This is my
review.

## What is BugProve?

BugProve is a security analysis platform for IoT firmware.
It is a cloud-based service that allows you to upload firmware images and
analyze them for security issues.

The service offers a free tier that allows you to scan up to 3 firmware images
per month. They offer paid tiers for teams and enterprises. See their [pricing
page](https://bugprove.com/pricing) to learn more.

## Who Should Use BugProve?

Before diving into my experience with BugProve, it's important to clarify who
this tool is designed for. While individual users can certainly utilize BugProve
to analyze their own IoT devices, the tool's primary audience includes:

- **IoT Manufacturers**: Engineers and developers actively involved in the design and testing of IoT products.
- **Security Laboratories**: Professional teams conducting thorough audits of IoT devices.
- **Bug Bounty Hunters**: Skilled individuals who specialize in discovering and reporting security vulnerabilities.

For individuals keen on analyzing their IoT devices, it's worth noting that they
would need either the firmware itself or the expertise in reverse engineering to
extract the firmware from the device.

## How does it work?

BugProve uses their own custom analysis engine called
[PRIS](https://bugprove.com/knowledge-hub/iot-bug-bounty-hunting-using-bug-prove/)
(I couldn't find out what it stands for) to analyze firmware images.

Here is how BugProve [describes it in their own words](https://bugprove.com/docs/#/getting-started/quickstart/exploring-scans/pris-tm):

> PRIS is BugProve's semi-dynamic security analysis engine that builds on
> different ideas from academic research in program analysis, and its main
> objective is to identify those vulnerabilities that have the highest potential
> of becoming practically exploitable security weaknesses.

No source code is needed for the analysis. Instead, PRIS analyzes the binary
code directly. It uses a combination of static and dynamic analysis to find
security issues.
In a blog post, BugProve [explains why both static and dynamic analysis are
needed](https://bugprove.com/knowledge-hub/binary-analysis-fundamentals/):

> Static analysis requires less time and can consider all execution paths in a
> program, whereas dynamic analysis is much more resource intensive and only
> considers a single execution path. However, dynamic analysis is typically more
> precise because it works with genuine values. Quite often, combining the
> advantages of static and dynamic analysis in a hybrid approach is the optimal
> solution.

The analysis is based on the disassembly of the firmware image (e.g. an ELF binary).
The engine is closed source and written in Python.

![Code example from the homepage](/assets/images/blog/bugprove/code-example.jpg)

## How to use it?

To use BugProve, you need to create an account and log in.
Uploading a firmware image is as simple as clicking the "Upload" button and
selecting the file from your computer.

![Upload button](/assets/images/blog/bugprove/upload.jpg)

BugProve asks you to select a scan type. You can choose between "Product" and
"Project". Here is how they describe the difference:

* Use a Project to group otherwise unrelated scans together - they are simple
  folders that show the total number of findings in all their scans.
* Product: Scans for the same device or device family can be grouped together in
  a Product, which keeps track of the latest firmware version and can share
  exploitability information between scans.


Essentially, if you're interested in developing a product and measuring the
security of your firmware over time, you should use a "Product". If you're just
interested in a single scan, you should use a "Project".

The scan starts automatically and you can see the progress in the web interface.
You can also close the browser tab and wait for the email notification that gets
sent as soon as the scan is finished. Once it's done, you should see the results
in the web interface.

Let's take it for a spin!

## Testing BugProve with a test firmware image

Initially, I was asking myself: "Where do I get a firmware image to test this?"

Fortunately, BugProve provides a few test images to get started.
For example, they provide a Raspberry Pi image that you can download and test,
called `IoTGoat-raspberry-pi2.img`.

This is great for beginners, and the interface also provides helpful hints on
what to do next.

Nevertheless, I wanted to try it with a custom firmware image, so 
I asked a friend who has a lot of experience with embedded devices and he
provided a firmware image for [a simple Rust program that makes an LED
blink](https://github.com/nrf-rs/microbit/tree/main/examples/gpio-hal-blinky).
This was a good "hello world" example to test the pipeline.

I uploaded the firmware image and selected "Project" as the scan type.

![Scan type selection](/assets/images/blog/bugprove/scan-type.jpg)

During the scan, I could see the progress in the web interface.

![scan1](/assets/images/blog/bugprove/scan1.jpg)

## First results

Depending on the uploaded payload and the number of scans in the queue, the scan
can take a while, and it wasn't always clear if the scan was still running or if
it got stuck. There were no logs or any other information that I could use to
reassure myself of the progress. It changed the status from "Decompiling" to
"Analyzing", after a while, so I knew we were on the right track.

![scan1-analyzing](/assets/images/blog/bugprove/scan1-analyzing.jpg)

In my case, the uploaded file was 3.1 MB in size and it took 6 minutes to scan.
I received a friendly email when the scan was done, however, so in a real-world
scenario, I wouldn't have to wait for the scan to finish.
Nevertheless, an estimated time to completion would have been nice.

The scan results are very detailed and easy to understand. BugProve shows the
architecture of the binary (ARM) and the total number of functions analyzed (167
in my case).

As was expected, my little "hello world" program did not contain any security
issues. The scan detected 0 vulnerabilities. That was reassuring!

![scan1-result](/assets/images/blog/bugprove/scan1-result.jpg)

The results can be shared with external viewers, which could be useful for
security researchers who want to share their findings with a vendor or a colleague
or prove that a firmware image is safe.

![scan1-report-link](/assets/images/blog/bugprove/scan1-report-link.jpg)

## Second scan: Testing a vulnerable firmware image

Next, I tried to upload a vulnerable firmware image from [a GitHub repository](https://github.com/iv-wrt/iv-wrt).
It was the image of an intentionally vulnerable router firmware distribution based on [OpenWrt](https://openwrt.org/), a popular
Linux distribution for embedded devices like routers.

The binary was 9.2 MB in size.
During the scanning process, the progress bar was stuck on 10% for a long time.
At this point, I really wasn't sure if the scan was still running or not.
After 39 minutes, it failed with `unknown error`. There was no additional information.

![scan2-failed](/assets/images/blog/bugprove/scan2-failed.jpg)

The email notification wasn't more helpful, either. As before, it just said that
the scan failed.

![scan2-failed-mail](/assets/images/blog/bugprove/scan2-failed-mail.jpg)

This experience was not so pleasant, to be honest. I would have liked to see the
log of the scan to find out what went wrong. My understanding is that this
information is probably withheld to prevent attackers from inferring information
about the analysis engine and to ensure the stability of the platform. As a
user, however, I was reaching for more information at this point.

**Update:** Following further discussions with the BugProve team, it became clear that the
scan's failure was attributed to the image being a QEMU image, designed for
emulation within the QEMU environment, rather than a genuine firmware image
typically found in a device's flash memory. This confusion arose because the
engine mistook it for an ELF binary, a mix-up caused by the method of
compression used. The team at BugProve also informed me that they are currently
developing a more descriptive error message to address this specific scenario.

## Third test: A real-world firmware image

Finally, I tried firmware for the ECOVACS Deebot T20e OMNI 6000Pa, a
new robot vacuum cleaner that I looked at recently.

My hope was that the firmware can be found in the [download section of the
manufacturer's website](https://www.ecovacs.com/global/deebot-t20e/downloads). Unfortunately, that was not the case. 
Most firmware is downloaded automatically through the app nowadays.

As a normal user, I wouldn't know where to get the firmware from. I tried to get
the firmware elsewhere, but I couldn't find it.

I also tried to download the [firmware of a popular consumer camera firmware instead](https://www.tp-link.com/de/support/download/tapo-c200/), but there was no download link either.

At long last, I managed to find a firmware image for the [Roborock S5 Max robot vacuum cleaner](https://us.roborock.com/pages/roborock-s5-max) (my current dust buster) on a third-party website.
I retrieved it from a research website called [dontvacuum.me](https://dontvacuum.me/), which archives firmware images to analyze the security and privacy of embedded systems and IoT device.

![dustbuilder](/assets/images/blog/bugprove/dustbuilder.jpg)

The firmware image was significantly larger at 62 MB in size (compressed).

On BugProve, I chose "Product" this time as I wanted to group all scans for this
device together.

A handy feature of BugProve, available with the Team plan, is its automatic
monitoring of firmware images for new vulnerabilities. This ensures you stay
updated on security issues without the need for manual scans. Since I was using
the free tier, I didn't choose this option for my scan.

To my surprise, the scan was way faster this time. It took about a minute to
complete. On the results page, I could see that the scan detected 1,910
vulnerabilities and that the firmware was based on the 3.4.39 Linux kernel.

![scan3](/assets/images/blog/bugprove/scan3.jpg)

The amount of information on the firmware was incredible.

For each detected vulnerability, it showed the CVE number, a description, when
the CVE was first discovered, as well as a helpful and understandable
AI-generated explanation.

![scan3-cve](/assets/images/blog/bugprove/scan3-cve.jpg)

I found the provided information to be very helpful and concise.

![scan3-ai](/assets/images/blog/bugprove/scan3-ai.jpg)

Perhaps the most advanced feature, however, were Zero-Day scans. These are
vulnerabilities that have not yet been publicly disclosed and are therefore
highly dangerous. BugProve uses a combination of static and dynamic analysis to
find these vulnerabilities. It can find memory corruption issues and command
injection sites.

Out of the gate, it scanned the most common vulnerable binaries of the firmware.
In my case, these were `librrlocale.so`, `libnss_dns-2.19.so`, and `libresolv-2.19.so`.
It did not find any Zero-Day vulnerabilities in this case.

I also tasked it to scan specific vendor binaries, that are likely unknown to the engine.
These binaries usually contained `rr` in their name, which stands for "Roborock".

Among them were

* `rriot_tuya`: the SDK bindings of [Tuya](https://www.tuya.com/), a popular IoT platform 
* `RoboController`: the main binary of the robot vacuum cleaner
* `rr_loader`: an unknown loader of some sort; perhaps a bootloader?
* `librrlog`: a logging library by Roborock
* `librrlocale.so`: a localization library by Roborock

Scanning took about one hour to complete.
Here is a screenshot of the in-progress scan:

![Scan 3 pris](/assets/images/blog/bugprove/scan3-pris.jpg)

As you can see, it did not find any Zero-Day vulnerabilities in these binaries.
It failed to scan `rriot_tuya` and showed an error message instead. It would be
interesting to know why it failed. Later on, the check for `RoboController` also
failed with the same error message.

Another interesting feature was the detection of weak binaries.
BugProve provided a table with relevant data for each binary, such as the
number of `printf` or `strcpy` calls as well as checks for
various security features of the binary:

* **NX (Non Execute)**: Marks sections of memory to allow or block code execution.
* **PIE (Position Independent Executable)**: Loads binaries and dependencies into random memory locations each time executed, countering static memory layout and reducing attacker advantage.
* **ASLR (Address Space Layout Randomization)**: Randomizes address space in each execution, making memory addresses of running processes unpredictable and memory-focused attacks difficult.
* **RELRO (Relocation Read-Only)**: Protects ELF binaries by making the Global Offset Table (GOT) read-only after dynamic function resolution, preventing GOT overwriting.
* **Stack Canary**: Detects stack buffer overflow by placing a unique value before the stack return pointer, which, if altered, indicates a buffer overflow attempt, hindering stack-based attacks.

I liked that it also showed me, which binaries are "stripped", 
indicating whether they were compiled with debug information or not.
Debug information makes it easier to reverse engineer a binary,
so this makes picking the right binary to analyze easier.

![scan3-weak-binaries](/assets/images/blog/bugprove/scan3-weak-binaries.jpg)

In the dedicated cryptography section, I learned that the firmware image
contained (weak) private keys. This is a big no-no, as private keys should never be
shipped with the firmware image.

![scan3-crypto](/assets/images/blog/bugprove/scan3-crypto.jpg)

Lastly, the built-in file explorer was a nice touch! It allowed me to browse the file
system of the firmware image directly in the browser and offered a download link for each file.

This is great for quickly getting an idea of what's inside the firmware image
without any additional tooling.
I learned that Roborock uses the [BusyBox](https://busybox.net/) toolbox of Unix
utilities for their firmware, that they built the firmware on Ubuntu 14.04.3
LTS, and that they put their binaries in `opt/rockrobo`:

![scan3-explorer](/assets/images/blog/bugprove/scan3-explorer.jpg)

## Verdict

That sums up my experience with BugProve. Here is a quick summary of the pros and cons:

### Pros

Given that modern IoT hardware is such a black box, it is a good way to pull back the curtains
without having to reverse engineer the firmware yourself or installing any complex tooling.
The summary of the scan results is very detailed and easy to understand. Furthermore, the
provided information is helpful and concise without being too technical or
overly verbose. On top of that, the built-in file explorer is a nice touch!

### Cons

While BugProve helpful tool for security researchers, it is not yet ready for casual users.

That is because of one main reason: it is hard to find firmware for devices that you own. Most vendors
don't provide a download link. Instead, they exclusively provide an update
mechanism through their app. This is not a flaw of BugProve, but with the wider
IoT ecosystem. It can be a problem if you want to quickly check your devices for security issues.
Security researchers don't run into this problem, because they already have the firmware image
at hand or can extract it from the device or through a proxy for the consumer the app. This 
is certainly an advanced process that goes beyond the abilities of most users.

From a user-experience perspective, I mainly have two improvement suggestions:

1. **Some scans took quite long.** The first scan took 6 minutes, the second scan
   failed after 39 minutes. The third scan took only a few seconds. 
   I would have liked to see the progress of the scan and an estimated time to completion while the scan was running.
   Fortunately, I didn't have to wait for the scan to finish. I could just close the browser tab and wait for the email notification. 
2. **Error diagnostics could be improved.** The error message `unknown error` is not very helpful. 
   It would be great to see the log of the scan to find out what went wrong and try again. At least a high-level summary of the error would have been nice.

Finally, I would have liked to see a more detailed explanation of the PRIS engine.
I understand that the engine is closed source and that the company wants to protect their intellectual property.
However, given that the engine is the core of the product, I would need more information to trust it
as a business user. A peer-reviewed whitepaper would be a good start.

## Conclusion

To sum up, BugProve stands out as a great tool for IoT manufacturers,
security labs, and professional bug bounty hunters. It serves as a bridge
between the complex world of IoT firmware security and the experts who safeguard
our digital landscape. 

If you're like me, trying to get your hands on firmware for a personal project
can be tough. But for those working in the field, BugProve is a game-changer.

## Try BugProve

Whether you're a professional in the field of IoT security or an enthusiast
looking to delve deeper, BugProve offers valuable insights and analysis
capabilities. Visit their [website](https://bugprove.com/) to learn more and
explore their free tier and advanced options for professionals.


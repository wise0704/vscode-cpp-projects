# Configure the output file name.
# $(BUILD) = Debug/Release, $(TARGET) = x86/x64
OUT := <name:[\\/:*?"<>|],_>
DIR := /$(BUILD)/$(TARGET)

# Configure the compiler options.
CXXFLAGS := -Wall -Wextra -Iinclude -Llib -std=<standard>

ifeq ($(BUILD),Debug)
# Configure additional options for debug.
CXXFLAGS += -ggdb -D_DEBUG
else ifeq ($(BUILD),Release)
# Configure additional options for release.
CXXFLAGS += -O2 -DNDEBUG
endif

ifeq ($(TARGET),x86)
CXXPATH := <gcc32>
CXXFLAGS += -m32
else ifeq ($(TARGET),x64)
CXXPATH := <gcc64>
CXXFLAGS += -m64
endif
ifdef CXXPATH
export PATH := $(CXXPATH)
endif

all: bin$(DIR)/$(OUT)

run: bin$(DIR)/$(OUT)
	./$<

bin$(DIR)/$(OUT): src/*.cpp | bin$(DIR)
	$(CXX) $(CXXFLAGS) $< -o $@

ifeq ($(OS),Windows_NT)
bin$(DIR):
	mkdir "$@"
else
bin$(DIR):
	mkdir -p $@
endif
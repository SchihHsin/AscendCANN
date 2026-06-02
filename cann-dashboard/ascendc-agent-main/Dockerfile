FROM  swr.cn-south-1.myhuaweicloud.com/ascendhub/cann:8.5.0-910b-openeuler24.03-py3.11

# Set environment variables for Ascend
# Source the set_env.sh script
RUN echo 'source /usr/local/Ascend/ascend-toolkit/set_env.sh' >> ~/.bashrc && \
    echo 'export ASCEND_INSTALL_PATH=/usr/local/Ascend/ascend-toolkit/latest/' >> ~/.bashrc && \
    echo 'export CMAKE_PREFIX_PATH=/usr/local/Ascend/ascend-toolkit/latest/aarch64-linux/tikcpp:$CMAKE_PREFIX_PATH' >> ~/.bashrc

# Also set environment variables globally for non-interactive use
ENV ASCEND_INSTALL_PATH=/usr/local/Ascend/ascend-toolkit/latest/
ENV CMAKE_PREFIX_PATH=/usr/local/Ascend/ascend-toolkit/latest/aarch64-linux/tikcpp

# Install Python packages for testing
# Disable progress bar to avoid threading issues in Docker build
RUN pip3 install --progress-bar off numpy

# Set working directory to a default location
WORKDIR /workspace

# When the container starts, start a bash shell with environment sourced
CMD ["/bin/bash"]

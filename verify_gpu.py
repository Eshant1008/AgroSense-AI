import torch
import torchvision
import onnxruntime as ort

print("=" * 45)
print("  AgroSense — Phase 0 GPU Verification")
print("=" * 45)

print(f"\n PyTorch version   : {torch.__version__}")
print(f" Torchvision       : {torchvision.__version__}")

cuda_ok = torch.cuda.is_available()
print(f"\n CUDA available    : {cuda_ok}")

if cuda_ok:
    print(f" CUDA version      : {torch.version.cuda}")
    print(f" GPU name          : {torch.cuda.get_device_name(0)}")
    vram = torch.cuda.get_device_properties(0).total_memory
    print(f" VRAM              : {vram / 1024**3:.1f} GB")

    print("\n Running GPU computation test...")
    x = torch.randn(2000, 2000, device="cuda")
    y = torch.randn(2000, 2000, device="cuda")
    z = torch.mm(x, y)
    torch.cuda.synchronize()
    print(f" Matrix multiply   : {z.shape}  ✓")
    print(f" Max GPU memory    : {torch.cuda.max_memory_allocated() / 1024**2:.0f} MB")

    providers = ort.get_available_providers()
    gpu_ort = "CUDAExecutionProvider" in providers
    print(f"\n ONNX Runtime GPU  : {'✓ Ready' if gpu_ort else '✗ CPU only'}")

    print("\n" + "=" * 45)
    print("  ✅  All systems go. Ready for Phase 1.")
    print("=" * 45)

else:
    print("\n ✗  GPU not detected.")
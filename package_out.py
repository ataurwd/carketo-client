import os
import zipfile

def zip_out_directory(source_dir="out", output_zip="out.zip"):
    if not os.path.exists(source_dir):
        print(f"Error: {source_dir} directory not found! Run 'npm run build' first.")
        return False
    
    with zipfile.ZipFile(output_zip, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(source_dir):
            for file in files:
                full_path = os.path.join(root, file)
                rel_path = os.path.relpath(full_path, start=source_dir)
                posix_path = rel_path.replace(os.sep, '/')
                zipf.write(full_path, arcname=posix_path)
                
    print(f"[OK] Successfully created POSIX-compliant {output_zip} containing all files from {source_dir}/!")
    return True

if __name__ == "__main__":
    zip_out_directory()

'use client';

import { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { productStore } from '@/stores/product.store';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Field,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CategoryService } from '@/services/category.service';
import { useRouter } from 'next/navigation';
import {profileStore} from "@/stores/profile.store";

const CreateProductPage = observer(() => {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    isActive: true,
    categoryId: '',
    photo: null,
  });

  const [categories, setCategories] = useState([]);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await CategoryService.getAll();
        setCategories(data);
        if (data.length > 0) {
          setForm((prev) => ({ ...prev, categoryId: data[0].id }));
        }
      } catch (err) {
        console.error('Ошибка при загрузке категорий', err);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    handleChange('photo', file);
    setPreview(file ? URL.createObjectURL(file) : null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dto = { ...form, price: Number(form.price), stock: Number(form.stock) };
    await productStore.create(dto);
    try {
      await profileStore.fetchProfile();
    } catch (err) {
      console.log(err)
    }
    router.push('/profile');

  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black p-4">
      <Card className="w-full max-w-2xl border bg-white dark:bg-black">
        <CardHeader>
          <CardTitle className="text-blue-600">Mahsulot yaratish</CardTitle>
          <CardDescription>
            Quyidagi ma’lumotlarni to‘ldiring va yangi mahsulot yarating
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="name">Nomi</FieldLabel>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="Mahsulot nomi"
                  required
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="description">Tavsif</FieldLabel>
                <Textarea
                  id="description"
                  value={form.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="Mahsulot tavsifi"
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="price">Narx</FieldLabel>
                <Input
                  id="price"
                  type="number"
                  value={form.price}
                  onChange={(e) => handleChange('price', e.target.value)}
                  placeholder="Narx"
                  required
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="stock">Mavjudligi (Stock)</FieldLabel>
                <Input
                  id="stock"
                  type="number"
                  value={form.stock}
                  onChange={(e) => handleChange('stock', e.target.value)}
                  placeholder="Soni"
                />
              </Field>

              <Field className={'w-8'}>
                <FieldLabel htmlFor="isActive">Faol</FieldLabel>
                <Switch
                  id="isActive"
                  checked={form.isActive}
                  onCheckedChange={(checked) => handleChange('isActive', checked)}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="category">Kategoriya</FieldLabel>
                <Select
                  value={form.categoryId}
                  onValueChange={(value) => handleChange('categoryId', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Kategoriya tanlang" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field>
                <FieldLabel htmlFor="photo">Rasm</FieldLabel>
                <Input
                  id="photo"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                />
                {preview && (
                  <img
                    src={preview}
                    alt="Preview"
                    className="mt-2 max-h-48 object-contain border"
                  />
                )}
              </Field>

              <Field>
                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={productStore.loading}
                >
                  {productStore.loading ? "Yuklanmoqda..." : "Yaratish"}
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
});

export default CreateProductPage;
